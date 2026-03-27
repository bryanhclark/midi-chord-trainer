import React, { useState } from 'react'
import { useMidi } from "@/contexts/MidiContext"
import { useEffect, useRef } from "react"
import * as Tone from "tone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import type { Quiz } from '@/lib/types'

const C_MAJOR_CHORD = ["C3", "E3", "G3"]

type SynthProps = {
  quiz: Quiz;
}

export const Synth: React.FC<SynthProps> = ({ quiz }) => {
  const { midiAccess } = useMidi()

  const synthRef = useRef<Tone.PolySynth | null>(null)
  const [currentNotes, setCurrentNotes] = useState<string[]>([])
  const [isChordCorrect, setIsChordCorrect] = useState<boolean>(false)

  const getMidiMessage = (message: MIDIMessageEvent) => {
    if (!message.data) return
    const [command, note, velocity] = message.data;
    const freq = Tone.Frequency(note, "midi").toNote();

    // Note On (144)
    if (command === 144 && velocity > 0) {
      synthRef.current?.triggerAttack(freq, Tone.now(), velocity / 127);
      setCurrentNotes(prev => [...prev, freq])
    }
    // Note Off (128 or 144 with 0 velocity)
    else if (command === 128 || (command === 144 && velocity === 0)) {
      synthRef.current?.triggerRelease(freq);
      setCurrentNotes(prev => prev.filter((note) => note !== freq))
    }
  }

  useEffect(() => {
    if (!midiAccess) return

    synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();

    midiAccess.inputs.forEach((input) => {
      if (input.name !== 'Arturia MiniLab mkII') return
      input.addEventListener("midimessage", (message) => {
        getMidiMessage(message)
      });
    });

    return () => {
      if (!midiAccess) return
      midiAccess.inputs.forEach((input) => {
        input.removeEventListener("midimessage", (message) => {
          getMidiMessage(message)
        });
      });
      synthRef.current?.dispose()
    }

  }, [midiAccess])

  // TODO: create reducer to track currentChord and then check if currentChord is correct 
  // - if correct: set isChordCorrect to true and move to next chord
  // - if incorrect: set isChordCorrect to false and retry chord
  const firstChord = quiz.chords[0]
  useEffect(() => {
    if (currentNotes.length === firstChord.notes.length && currentNotes.every((note) => firstChord.notes.includes(note))) {
      setIsChordCorrect(true)
      setTimeout(() => {
        setIsChordCorrect(false)
      }, 1000)
    }
  }, [currentNotes])

  return (
    <Card size="sm" className='h-50 w-100'>
      <CardHeader>
        <CardTitle>Synth</CardTitle>
        <CardDescription>Play {firstChord.name}: </CardDescription>
        {isChordCorrect && <CardDescription>Success!</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-row justify-center gap-2">
        {currentNotes.map((note) => (
          <div className='flex' key={note}>{note}</div>
        ))}
      </CardContent>
    </Card>
  )
}
