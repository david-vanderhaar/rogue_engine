import { SOUND_MANAGER } from '../../sounds'

export function fadeMusicInOut(sound) {
  return () => {
    sound.play()
    sound.fade(0, 0.6, SOUND_MANAGER.master_track_fade_time) 
    // Clean up by removing the event listener when the component unmounts
    return () => {
      // sound.stop();
      sound.fade(0.6, 0, SOUND_MANAGER.master_track_fade_time / 4);
    };
  }
}
