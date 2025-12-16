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
  pass_turn: createSoundFromSource('/sounds/hidden_leaf/pass_turn.mp3'),
  status_effect_applied: createSoundFromSource('/sounds/hidden_leaf/status_effect_applied.mp3'),
  not_allowed: createSoundFromSource('/sounds/hidden_leaf/not_allowed.mp3'),
  speed_up: createSoundFromSource('/sounds/hidden_leaf/speed_up.mp3'),

  hidden_gate_0: createSoundFromSource('/sounds/hidden_leaf/hidden_gate_0.wav'),
  hidden_gate_1: createSoundFromSource('/sounds/hidden_leaf/hidden_gate_1.wav'),

  summon_1: createSoundFromSource('/sounds/hidden_leaf/summon_1.wav'),
  summon_2: createSoundFromSource('/sounds/hidden_leaf/summon_2.wav'),

  sword_clang: createSoundFromSource('/sounds/hidden_leaf/sword_clang.wav'),

  beast_bomb: createSoundFromSource('/sounds/hidden_leaf/beast_bomb.mp3', {rate: 4, volume: .6}),
  
  wood_button: createSoundFromSource('/sounds/hidden_leaf/wood_block.mp3'),
  title_theme: createSoundFromSource('/sounds/hidden_leaf/title_theme.mp3', {loop: true}),
  character_select_theme: createSoundFromSource('/sounds/hidden_leaf/character_select_theme.mp3', {loop: true}),
  tournament_theme: createSoundFromSource('/sounds/hidden_leaf/tournament_theme.mp3', {loop: true}),
  battle_theme_0: createSoundFromSource('/sounds/hidden_leaf/battle_theme_0.mp3', {loop: true}),
  win_theme: createSoundFromSource('/sounds/hidden_leaf/win_theme.mp3'),
  lose_theme: createSoundFromSource('/sounds/hidden_leaf/lose_theme.mp3'),
  ambient_howling: createSoundFromSource('/sounds/tall_grass/ambient_loop_howls.mp3', {loop: true, rate: 0.75, volume: 0.1}),
  wind_loop: createSoundFromSource('/sounds/tall_grass/wind_loop.mp3', {loop: true, rate: 0.75, volume: 0.1}),
  wind_loop_2: createSoundFromSource('/sounds/hidden_leaf/Wind.wav', {loop: true}),
  taiko_drum_loop: createSoundFromSource('/sounds/hidden_leaf/taiko_drum_loop.mp3'),
  take_melee_hit: createSoundFromSource('/sounds/tall_grass/monster/sac_01.ogg'),
  sac_01: createSoundFromSource('/sounds/tall_grass/monster/sac_01.ogg'),
  sac_02: createSoundFromSource('/sounds/tall_grass/monster/sac_02.ogg'),
  sac_03: createSoundFromSource('/sounds/tall_grass/monster/sac_03.ogg'),
  screech_01: createSoundFromSource('/sounds/tall_grass/monster/screech_01.ogg'),
  screech_02: createSoundFromSource('/sounds/tall_grass/monster/screech_02.ogg'),
  screech_03: createSoundFromSource('/sounds/tall_grass/monster/screech_03.ogg'),
  // jutsus
  basic_jutsu_cast: createSoundFromSource('/sounds/hidden_leaf/hand_sign_activation.wav', {volume: 1}),
  sand_wall_01: createSoundFromSource('/sounds/hidden_leaf/sand_wall.wav', {volume: 1}),
  sand_clone_01: createSoundFromSource('/sounds/hidden_leaf/sand_clone.wav', {volume: 1}),
  swift_move: createSoundFromSource('/sounds/hidden_leaf/swift-move.wav', {volume: 1}),
  scratch_attack: createSoundFromSource('/sounds/hidden_leaf/scratch-attack.wav', {volume: 1}),
  // kunai throw
  kunai_throw_01: createSoundFromSource('/sounds/hidden_leaf/kunai_throw.wav'),
  kunai_throw_02: createSoundFromSource('/sounds/hidden_leaf/kunai_throw_2.wav'),
  // melee hits
  punch_01: createSoundFromSource('/sounds/hidden_leaf/punch--01.mp3'),
  punch_02: createSoundFromSource('/sounds/hidden_leaf/punch--02.mp3'),
  punch_03: createSoundFromSource('/sounds/hidden_leaf/punch--03.mp3'),
  punch_04: createSoundFromSource('/sounds/hidden_leaf/punch--04.mp3'),
  punch_05: createSoundFromSource('/sounds/hidden_leaf/punch--05.mp3'),
  punch_06: createSoundFromSource('/sounds/hidden_leaf/punch--06.mp3'),
  punch_07: createSoundFromSource('/sounds/hidden_leaf/punch--07.mp3'),
  punch_08: createSoundFromSource('/sounds/hidden_leaf/punch--08.mp3'),
  // end
  // take damage
  take_damage_01: createSoundFromSource('/sounds/hidden_leaf/take-damage-01.mp3', {volume: 0.4}),
  take_damage_02: createSoundFromSource('/sounds/hidden_leaf/take-damage-02.mp3', {volume: 0.4}),
  take_damage_03: createSoundFromSource('/sounds/hidden_leaf/take-damage-03.mp3', {volume: 0.4}),
  take_damage_04: createSoundFromSource('/sounds/hidden_leaf/take-damage-04.mp3', {volume: 0.4}),
  take_damage_05: createSoundFromSource('/sounds/hidden_leaf/take-damage-05.mp3', {volume: 0.4}),
  take_damage_06: createSoundFromSource('/sounds/hidden_leaf/take-damage-06.mp3', {volume: 0.4}),
  take_damage_07: createSoundFromSource('/sounds/hidden_leaf/take-damage-07.mp3', {volume: 0.4}),
  take_damage_08: createSoundFromSource('/sounds/hidden_leaf/take-damage-08.mp3', {volume: 0.4}),
  take_damage_09: createSoundFromSource('/sounds/hidden_leaf/take-damage-09.mp3', {volume: 0.4}),
  take_damage_10: createSoundFromSource('/sounds/hidden_leaf/take-damage-10.mp3', {volume: 0.4}),
  take_damage_11: createSoundFromSource('/sounds/hidden_leaf/take-damage-11.mp3', {volume: 0.4}),
  // end
  // water
  water_01: createSoundFromSource('/sounds/hidden_leaf/water-01.mp3'),
  water_02: createSoundFromSource('/sounds/hidden_leaf/water-02.mp3'),
  water_03: createSoundFromSource('/sounds/hidden_leaf/water-03.mp3'),
  water_04: createSoundFromSource('/sounds/hidden_leaf/water-04.mp3'),
  water_05: createSoundFromSource('/sounds/hidden_leaf/water-05.mp3'),
  water_06: createSoundFromSource('/sounds/hidden_leaf/water-06.mp3'),
  // hard GROUND
  hard_ground_01: createSoundFromSource('/sounds/hidden_leaf/hard_ground-01.mp3'),
  hard_ground_02: createSoundFromSource('/sounds/hidden_leaf/hard_ground-02.mp3'),
  hard_ground_03: createSoundFromSource('/sounds/hidden_leaf/hard_ground-03.mp3'),
  hard_ground_04: createSoundFromSource('/sounds/hidden_leaf/hard_ground-04.mp3'),
  // grass GROUND
  grass_00: createSoundFromSource('/sounds/tall_grass/rustle/grass_00.mp3'),
  grass_01: createSoundFromSource('/sounds/tall_grass/rustle/grass_01.mp3'),
  grass_02: createSoundFromSource('/sounds/tall_grass/rustle/grass_02.mp3'),
  grass_03: createSoundFromSource('/sounds/tall_grass/rustle/grass_03.mp3'),
  grass_04: createSoundFromSource('/sounds/tall_grass/rustle/grass_04.mp3'),
  grass_05: createSoundFromSource('/sounds/tall_grass/rustle/grass_05.mp3'),
  grass_06: createSoundFromSource('/sounds/hidden_leaf/grass_06.mp3'),
  grass_07: createSoundFromSource('/sounds/hidden_leaf/grass_07.mp3'),
  // end steps
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