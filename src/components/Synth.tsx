import React from 'react'
import { useMidi } from "@/contexts/MidiContext"
import { useEffect, useRef } from "react"
import * as Tone from "tone"


export const Synth: React.FC = () => {
  const { midiAccess } = useMidi()

  const synthRef = useRef<Tone.PolySynth | null>(null)
  const [currentNotes, setCurrentNotes] = React.useState<string[]>([])

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

  return (
    <div>
      <h1>Synth</h1>
      <p>{currentNotes}</p>
    </div>
  )
}
