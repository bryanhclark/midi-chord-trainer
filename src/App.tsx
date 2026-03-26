import React from 'react'
import './App.css'
import { MidiContextProvider } from './contexts/MidiContext'
import { Synth } from './components/Synth'
import { Button } from './components/ui/button'

function App() {
  const [audioStarted, setAudioStarted] = React.useState(false)
  return (
    <div className='h-screen flex items-center justify-center'>
      <MidiContextProvider>
        {!audioStarted ? <Button onClick={() => setAudioStarted(true)}>start audio</Button> : <Synth />}
      </MidiContextProvider>
    </div>
  )
}

export default App
