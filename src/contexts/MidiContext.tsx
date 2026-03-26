import React, { createContext, useEffect, useRef, } from 'react';

type IMidiContext = {
  midiAccess: MIDIAccess | null
}

const MidiContext = createContext<IMidiContext>({
  midiAccess: null
});

export const MidiContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [midiAccess, setMidiAccess] = React.useState<MIDIAccess | null>(null)


  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then((access: MIDIAccess) => {
        setMidiAccess(access)
      })
    }
  }, [])

  const contextValue: IMidiContext = {
    midiAccess
  }

  return (
    <MidiContext.Provider value={contextValue}>

      {children}
    </MidiContext.Provider>
  );
};

export const useMidi = () => React.useContext(MidiContext);
