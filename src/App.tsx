import { useState } from 'react'
import './App.css'
import { MidiContextProvider } from './contexts/MidiContext'
import { Button } from './components/ui/button'
import { QuizForm } from './components/quiz/QuizForm'
import type { Quiz } from './lib/types'
import { Synth } from './components/Synth'



function App() {
  const [audioStarted, setAudioStarted] = useState(false)
  const [createdQuiz, setCreatedQuiz] = useState<Quiz | null>(null)

  const onSubmit = (quiz: Quiz) => {
    setCreatedQuiz(quiz)
  }

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <MidiContextProvider>
        {!audioStarted && <Button onClick={() => setAudioStarted(true)}>start audio</Button>}
        {createdQuiz && <Synth quiz={createdQuiz} />}
        {audioStarted && !createdQuiz && <QuizForm onSubmit={onSubmit} />}
      </MidiContextProvider>
    </div >
  )
}

export default App
