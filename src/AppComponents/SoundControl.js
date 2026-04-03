import React, { use, useEffect, useState } from 'react';
import { Howler } from 'howler';

export default function SoundControl() {
  const [muted, setMuted] = useState(false);
  const [volume, setVolumeState] = useState(Howler.volume());

  const toggleSound = () => {
    const newMutedState = !muted;
    setMuted(newMutedState);
    Howler.mute(newMutedState);
  };

  const setVolume = (volume) => {
    Howler.volume(volume);
    setVolumeState(volume);
  }

  const increaseVolume = () => {
    const newVolume = Math.min(1, Howler.volume() + 0.1);
    setVolume(newVolume);
  }

  const decreaseVolume = () => {
    const newVolume = Math.max(0, Howler.volume() - 0.1);
    setVolume(newVolume);
  }
  
  useEffect(() => {
    const handleKeyPress = (event) => {
      // if (event.code === 'BracketRight') {
      //   toggleSound();
      // }
      if (event.code === 'BracketRight') {
        increaseVolume();
      } else if (event.code === 'BracketLeft') {
        decreaseVolume();
      }
    };
    
    // Add event listener when the component mounts
    window.addEventListener('keydown', handleKeyPress);
    
    // Clean up by removing the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [volume]);

  // Set initial mute state on component mount
  useEffect(() => {
    Howler.mute(muted);
  }, []);

  return (
    // <div onClick={toggleSound} style={{cursor: 'pointer'}}>
    <div>
      <span >
        {/* toggle sound: ] {muted ? '(off)' : '(on)'} */}
        current volume: {Math.round(volume * 100)}%
      </span>
      <br />
      <span>
        use [ and ] keys to adjust volume
      </span>
    </div>
  );
}
