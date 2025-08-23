import React, { use, useEffect, useState } from 'react';
import { Howler } from 'howler';

export default function SoundControl() {
  const [muted, setMuted] = useState(false);

  const toggleSound = () => {
    const newMutedState = !muted;
    setMuted(newMutedState);
    Howler.mute(newMutedState);
  };
  
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'BracketRight') {
        toggleSound();
      }
    };
    
    // Add event listener when the component mounts
    window.addEventListener('keydown', handleKeyPress);
    
    // Clean up by removing the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [muted]);

  // Set initial mute state on component mount
  useEffect(() => {
    Howler.mute(muted);
  }, []);

  return (
    <span onClick={toggleSound}>
      toggle sound: ] {muted ? '(off)' : '(on)'}
    </span>
  );
}
