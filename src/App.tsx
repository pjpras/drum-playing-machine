import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

// Define drum pad data structure
interface DrumPadData {
  id: string;
  letter: string;
  src: string;
  displayText: string;
}

// Extract drum pad configuration to avoid repetition
const DRUM_PADS: DrumPadData[] = [
  { id: "Heater-1", letter: "Q", src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3", displayText: "Heater-1" },
  { id: "Heater-2", letter: "W", src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3", displayText: "Heater-2" },
  { id: "Heater-3", letter: "E", src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3", displayText: "Heater-3" },
  { id: "Heater-4", letter: "A", src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3", displayText: "Heater-4" },
  { id: "Clap", letter: "S", src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3", displayText: "Clap" },
  { id: "Open-HH", letter: "D", src: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3", displayText: "Open-HH" },
  { id: "Kick-n'-Hat", letter: "Z", src: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3", displayText: "Kick-n'-Hat" },
  { id: "Kick", letter: "X", src: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3", displayText: "Kick" },
  { id: "Closed-HH", letter: "C", src: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3", displayText: "Closed-HH" },
];

// Create a reusable DrumPad component
const DrumPad: React.FC<{ pad: DrumPadData; onPlay: (letter: string, displayText: string) => void }> = ({ pad, onPlay }) => {
  return (
    <div 
      className="drum-pad" 
      id={pad.id} 
      onClick={() => onPlay(pad.letter, pad.displayText)}
    >
      {pad.letter}
      <audio
        src={pad.src}
        className="clip"
        id={pad.letter}
      />
    </div>
  );
};

function App() {
  const [display, setDisplay] = useState("");

  // Memoize the playSound function to avoid recreating it on each render
  const playSound = useCallback((id: string, displayText: string) => {
    const audio = document.getElementById(id) as HTMLAudioElement;
    if (audio && typeof audio.play === "function") {
      audio.currentTime = 0;
      audio.play();
      setDisplay(displayText);
    } else {
      console.error(`Audio element with id ${id} not found or play is not a function`);
    }
  }, []);

  // Use keydown map for more efficient key handling
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const drumPad = DRUM_PADS.find(pad => pad.letter === key);
      if (drumPad) {
        playSound(drumPad.letter, drumPad.displayText);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [playSound]);

  return (
    <div className="container">
      <div id="drum-machine">
        <h1 className="title">Drum Machine</h1>
        <div id="display">
          {display || "Play a sound"}
        </div>
        
        <div className="drum-grid">
          {DRUM_PADS.map(pad => (
            <DrumPad
              key={pad.letter}
              pad={pad}
              onPlay={playSound}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;