import { Howl, Howler } from 'howler';

const SOUNDS = {}

const createSoundFromSource = (relativePath, howlerOptions = {}, key = null) => {
  const sound = new Howl({
    src: [window.PUBLIC_URL + relativePath],
    volume: 0.2,
    loop: false,
    ...howlerOptions,
  })

  if (key === null) {
    // get the file name of the sound without the extension (.mp3)
    key = relativePath.split('/').at(-1).split('.').at(0)
  }

  SOUNDS[key] = sound
  return sound
}

SOUNDS['ui_button'] = createSoundFromSource('/sounds/ui/ui_button.wav')

const master_track_fade_time = 3000 // in milliseconds
const SoundManager = {
  master_track_fade_time,
  setMasterVolume: (volume) => Howler.volume(volume),
  fadeInSound: (sound) => {
    sound.play()
    sound.fade(0, sound.volume(), master_track_fade_time) 
  },
  fadeOutSound: (sound) => {
    sound.fade(sound.volume(), 0, master_track_fade_time / 4)
    setTimeout(() => sound.stop(), master_track_fade_time / 4)
  },
  stopAll: () => {Howler.unload()},
  createSoundFromSource,
  getSounds: () => SOUNDS,
  getSound: (key) => SOUNDS[key],
}

export default SoundManager
