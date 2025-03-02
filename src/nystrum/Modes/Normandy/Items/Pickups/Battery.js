import * as Helper from '../../../../../helper';
import {RenderedWithPickUpEffects} from '../../../../Entities/index';
import { JACINTO_SOUNDS } from '../../../Jacinto/sounds';
import {COLORS} from '../../theme';

export const Battery = (strength = 4) => {
  let isUsed = false

  function activateLight(actor, item) {
    if (isUsed) return
  
    const pos = actor.getPosition()
    const currentTile = Helper.getTileAtPosition(actor.game, pos)
    const tiles = Helper.getNeighboringTiles(actor.game.map, pos).concat(currentTile)
    const lights = tiles.reduce((acc, tile) => {
      const lightsOnTile = Helper.filterEntitiesByType(tile.entities, 'ILLUMINATING')
      const equippingEntities = Helper.filterEntitiesByType(tile.entities, 'EQUIPING')
      let lightsEquipped = []

      equippingEntities.forEach((entity) => {
        const items = Helper.filterEntitiesByType(entity.getEquippedItems(), 'ILLUMINATING')
        lightsEquipped = lightsEquipped.concat(items)
      })

      return acc.concat(lightsOnTile).concat(lightsEquipped)
    }, [])
  
    if (lights.length === 0) return
  
    lights.forEach((light) => {
      Helper.range(strength).forEach((i) => {
        setTimeout(() => {
          light.incrementLightRange()
          actor.game.draw()
        }, 250 * i)
      })
      // light.incrementLightRange(strength)
    })
    item.name = 'used battery'
    item.renderer.background = COLORS.gray
    item.renderer.color = COLORS.orange
    item.addDescriptor('a spent battery, not much use anymore.')
    isUsed = true

    // spawn rare loot
  }

  return new RenderedWithPickUpEffects({
    name: 'battery',
    baseDescription: 'special tech allows this battery to power up any adjacent light when dropped.',
    passable: true,
    lightPassable: true,
    renderer: {
      character: '%',
      sprite: '%',
      background: COLORS.orange,
      color: COLORS.white,
    },
    dropEffects: [activateLight]
  });
}
