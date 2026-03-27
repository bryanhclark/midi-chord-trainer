import type { Chord, Quiz } from '@/lib/types'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { MAJOR_CHORDS } from '@/data/MAJOR_CHORDS'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Button } from '../ui/button'

interface QuizFormProps {
  onSubmit: (quiz: Quiz) => void
}

export const QuizForm: React.FC<QuizFormProps> = ({ onSubmit }) => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)

  const onCheckboxChange = (key: string) => (checked: boolean) => {
    const chord: Chord = {
      name: key,
      notes: MAJOR_CHORDS[key]
    }
    if (currentQuiz) {
      if (checked) {
        setCurrentQuiz({
          ...currentQuiz,
          chords: [...currentQuiz.chords, chord]
        })
      } else {
        setCurrentQuiz({
          ...currentQuiz,
          chords: currentQuiz.chords.filter(chord => chord.name !== key)
        })
      }
    }
    if (!currentQuiz) {
      setCurrentQuiz({
        chords: [chord]
      })
    }
  }

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Quiz:</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup className='grid grid-cols-4'>
          {Object.keys(MAJOR_CHORDS).map((key: string) => {
            const id = `chord-${key}`
            const checked = currentQuiz ? currentQuiz.chords.some(chord => chord.name === key) : false;
            return (
              <Field key={id} orientation='horizontal'>
                <Checkbox
                  id={id}
                  name={id}
                  checked={checked}
                  value={key}
                  onCheckedChange={onCheckboxChange(key)}
                />
                <FieldLabel htmlFor={id} className='text-lg'>{key}</FieldLabel>
              </Field>
            )
          })}
        </FieldGroup>
        <div className='flex justify-end mt-4'>
          <Button
            disabled={!currentQuiz}
            onClick={() => {
              if (!currentQuiz) {
                return
              }
              onSubmit(currentQuiz)
            }}
          >Submit</Button>
        </div>
      </CardContent>
    </Card >
  )
}
