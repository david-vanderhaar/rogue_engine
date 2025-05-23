import { Howl, Howler } from 'howler';

const createSoundFromSource = (relativePath, howlerOptions = {}) => {
  return new Howl({
    src: [window.PUBLIC_URL + relativePath],
    volume: 0.2,
    loop: false,
    ...howlerOptions,
  })
}

export const SOUND_MANAGER = {
  master_track_fade_time: 3000, // in milliseconds
  setMasterVolume: (volume) => Howler.volume(volume),
  setVolume: (volume) => {
    Object.entries(SOUNDS).forEach(([key, sound]) => {
      sound.volume(volume)
    })
  },
}

export const SOUNDS = {
  wood_button: createSoundFromSource('/sounds/hidden_leaf/wood_block.mp3'),
  title_theme: createSoundFromSource('/sounds/hidden_leaf/title_theme.mp3', {loop: true}),
  character_select_theme: createSoundFromSource('/sounds/hidden_leaf/character_select_theme.mp3', {loop: true}),
  tournament_theme: createSoundFromSource('/sounds/hidden_leaf/tournament_theme.mp3', {loop: true}),
  battle_theme_0: createSoundFromSource('/sounds/hidden_leaf/battle_theme_0.mp3', {loop: true}),
  win_theme: createSoundFromSource('/sounds/hidden_leaf/win_theme.mp3'),
  lose_theme: createSoundFromSource('/sounds/hidden_leaf/lose_theme.mp3'),
  ambient_howling: createSoundFromSource('/sounds/tall_grass/ambient_loop_howls.mp3', {loop: true, rate: 0.75, volume: 0.1}),
  wind_loop: createSoundFromSource('/sounds/tall_grass/wind_loop.mp3', {loop: true, rate: 0.75, volume: 0.1}),
  sac_01: createSoundFromSource('/sounds/tall_grass/monster/sac_01.ogg'),
  sac_02: createSoundFromSource('/sounds/tall_grass/monster/sac_02.ogg'),
  sac_03: createSoundFromSource('/sounds/tall_grass/monster/sac_03.ogg'),
  screech_01: createSoundFromSource('/sounds/tall_grass/monster/screech_01.ogg'),
  screech_02: createSoundFromSource('/sounds/tall_grass/monster/screech_02.ogg'),
  screech_03: createSoundFromSource('/sounds/tall_grass/monster/screech_03.ogg'),
  grass_00: createSoundFromSource('/sounds/tall_grass/rustle/grass_00.mp3'),
  grass_01: createSoundFromSource('/sounds/tall_grass/rustle/grass_01.mp3'),
  grass_02: createSoundFromSource('/sounds/tall_grass/rustle/grass_02.mp3'),
  grass_03: createSoundFromSource('/sounds/tall_grass/rustle/grass_03.mp3'),
  grass_04: createSoundFromSource('/sounds/tall_grass/rustle/grass_04.mp3'),
  grass_05: createSoundFromSource('/sounds/tall_grass/rustle/grass_05.mp3'),
  light_up: createSoundFromSource('/sounds/tall_grass/light_up.mp3'),
  light_drain: createSoundFromSource('/sounds/tall_grass/light_drain.mp3', {volume: 0.2}),
  emergence_01: createSoundFromSource('/sounds/jacinto/EarthDebrisSmallClose01.ogg'),
  emergence_02: createSoundFromSource('/sounds/jacinto/EarthDebrisSmallClose02.ogg'),
  cog_tags: createSoundFromSource('/sounds/jacinto/CogTags.ogg'),
  wretch_melee_01: createSoundFromSource('/sounds/jacinto/actors/wretch/AAttackSmall01.ogg'),
  wretch_melee_02: createSoundFromSource('/sounds/jacinto/actors/wretch/AAttackSmall03.ogg'),
  wretch_melee_03: createSoundFromSource('/sounds/jacinto/actors/wretch/AAttackSmall04.ogg'),
  scion_melee_01: createSoundFromSource('/sounds/jacinto/actors/wretch/AAttackSmall01.ogg', {rate: 0.5}),
  scion_melee_02: createSoundFromSource('/sounds/jacinto/actors/wretch/AAttackSmall03.ogg', {rate: 0.5}),
  scion_melee_03: createSoundFromSource('/sounds/jacinto/actors/wretch/AAttackSmall04.ogg', {rate: 0.5}),
  locust_buff_01: createSoundFromSource('/sounds/jacinto/actors/drone/AChatterAttack01.ogg'),
  locust_buff_02: createSoundFromSource('/sounds/jacinto/actors/drone/AChatterAttack02.ogg'),
  locust_buff_03: createSoundFromSource('/sounds/jacinto/actors/drone/AChatterAttack03.ogg'),
  reload: createSoundFromSource('/sounds/jacinto/weapons/reloadassault02.ogg'),
  needs_reload: createSoundFromSource('/sounds/jacinto/NeedsReload01.ogg'),
  level_start: createSoundFromSource('/sounds/jacinto/ObjectiveAdd01.ogg'),
  level_end: createSoundFromSource('/sounds/jacinto/ObjectiveComplete01.ogg'),
  cog_rifle_fire_01: createSoundFromSource('/sounds/jacinto/weapons/Assault_Fire_02.ogg'),
  cog_rifle_fire_02: createSoundFromSource('/sounds/jacinto/weapons/Assault_Fire_07.ogg'),
  cog_rifle_fire_03: createSoundFromSource('/sounds/jacinto/weapons/CogARifleFire02.ogg'),
  cog_rifle_fire_04: createSoundFromSource('/sounds/jacinto/weapons/CogARifleFire04.ogg'),
  shot_missed_01: createSoundFromSource('/sounds/jacinto/weapons/BBulletImpact10.ogg'),
  shot_missed_02: createSoundFromSource('/sounds/jacinto/weapons/BBulletImpact1.ogg'),
  longshot_fire_01: createSoundFromSource('/sounds/jacinto/weapons/CogSniperFire01.ogg'),
  longshot_fire_02: createSoundFromSource('/sounds/jacinto/weapons/CogSniperFire02.ogg'),
  longshot_fire_03: createSoundFromSource('/sounds/jacinto/weapons/CogSniperFire03.ogg'),
  pistol_fire_01: createSoundFromSource('/sounds/jacinto/weapons/CogPistolFire01.ogg'),
  pistol_fire_02: createSoundFromSource('/sounds/jacinto/weapons/CogPistolFire02.ogg'),
  chainsaw_01: createSoundFromSource('/sounds/jacinto/weapons/ChainsawRevIdle01.ogg'),
  chainsaw_02: createSoundFromSource('/sounds/jacinto/weapons/ChainsawStart01.ogg'),
  grenade_ready: createSoundFromSource('/sounds/jacinto/weapons/GrenadeBeep02.ogg'),
  smoke_grenade_fire: createSoundFromSource('/sounds/jacinto/weapons/GrenadeSmokeSpew01.ogg'),
  boltok_fire_01: createSoundFromSource('/sounds/jacinto/weapons/LocustBoltok01.ogg'),
  boltok_fire_02: createSoundFromSource('/sounds/jacinto/weapons/LocustBoltok04.ogg'),
  hammerburst_fire_01: createSoundFromSource('/sounds/jacinto/weapons/LocustRifleFire01.ogg'),
  hammerburst_fire_02: createSoundFromSource('/sounds/jacinto/weapons/LocustRifleFire03.ogg'),
  bullet_hit_01: createSoundFromSource('/sounds/jacinto/weapons/RifleAmmoImpactBodyFlesh01.ogg'),
  bullet_hit_02: createSoundFromSource('/sounds/jacinto/weapons/RifleAmmoImpactBodyFlesh02.ogg'),
  bullet_hit_03: createSoundFromSource('/sounds/jacinto/weapons/RifleAmmoImpactBodyFlesh03.ogg'),
  bullet_miss_01: createSoundFromSource('/sounds/jacinto/weapons/RifleAmmoImpactDirt01.ogg'),
  bullet_miss_02: createSoundFromSource('/sounds/jacinto/weapons/RifleAmmoImpactDirt02.ogg'),
  bullet_miss_03: createSoundFromSource('/sounds/jacinto/weapons/RifleAmmoImpactDirt03.ogg'),
  explosion_01: createSoundFromSource('/sounds/jacinto/weapons/BoomerExplosionA01.ogg'),
  explosion_02: createSoundFromSource('/sounds/jacinto/weapons/BoomerExplosionB01.ogg'),
}