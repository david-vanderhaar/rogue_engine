import React from 'react';
import {
  GiCrosshair,
  GiBullets,
  GiBarbedArrow,
  GiBurningDot,
} from "react-icons/gi";
import {STAT_RENDERERS} from '../../theme';

function StatText({stat}) {
  const {value, name, abbreviatedName} = stat;
  const attributeNameStyle = {
    color: stat.renderer.background,
    marginRight: 10,
  }

  return (
    <div className="StatBlock--simple">
      <span style={attributeNameStyle}>{abbreviatedName}</span>
      <span>{value}</span>
    </div>
  )
}

const SimpleEquipmentCard = ({game, player, data}) => {
  const {
    item,
    equipped,
    amount,
    equipable,
  } = data;

  let needsReload = false;
  let magazine = null
  let magazineSize = null;
  if (item.hasOwnProperty('magazine')) {
    magazine = item.magazine;
    magazineSize = item.magazineSize;
    if (item.magazine <= 0) {
      needsReload = true;
    }
  }

  let stats = [];
  if (item.hasOwnProperty('attackRange')) {
    stats.push({
      name: 'attack range',
      abbreviatedName: 'rng',
      value: item['attackRange'],
      renderer: STAT_RENDERERS.attackRange,
      getIcon: () => <GiBarbedArrow />,
    })
  }
  if (item.hasOwnProperty('baseRangedDamage')) {
    stats.push({
      name: 'base damage',
      abbreviatedName: 'atk',
      value: item['baseRangedDamage'],
      renderer: STAT_RENDERERS.baseRangedDamage,
      getIcon: () => <GiBurningDot />,
    })
  }

  return (
    <div 
      className='SimpleEquipmentCard EquipmentCard'
      style={{
        // marginLeft: equipped ? 20 : 0,
        paddingLeft: 0,
        paddingBottom: 5,
      }}
    >
      <div className="EquipmentCard__item">
        <div className="EquipmentCard__item__label--simple">
          {amount && (<span className="EquipmentCard__item__label__amount">
            {amount}&nbsp;
          </span>)}
          <span style={{
            backgroundColor: item.renderer.background,
            color: item.renderer.color,
            borderColor: item.renderer.color,
            borderBottom: '1px solid',
            borderRadius: 2,
            padding: 6,
          }}>
            {item.name}&nbsp;
          </span>
          <div style={{marginTop: 6}}>
            {
              needsReload && (
                <span style={{color: '#6d7886'}}>
                  (reload)
                </span>
              ) || (
                [
                  ...Array(magazine).fill(''),
                  ...Array(magazineSize - magazine).fill('_'),
                ].join(' ')
              )
            }
          </div>
          {/* <div className="EquipmentCard__item__stats" style={{marginLeft: 10}}>
            {
              stats.map((stat, i) => {
                return (
                  <StatText
                    key={`${i}-${stat.name}-resource-block`}
                    stat={stat}
                  />
                )
              })
            }
          </div> */}
        </div>
      </div>
    </div>
  )
}

const AmmoBlock = ({ammoCount}) => {
  if (!!!ammoCount || ammoCount <= 0) return (
    <div style={{flex: 1}}>
      <span className="EquipmentCard__item__label__amount">
        no ammo&nbsp;
      </span>
      <div>
        <span style={{color: '#6d7886'}}>
          (find ammo)
        </span>
      </div>
    </div>
  );
  return (
    <div style={{flex: 1}}>
      <span className="EquipmentCard__item__label__amount">
        ammo&nbsp;
      </span>
      <div>
        {
          [...Array(ammoCount).fill('')].reduce((acc, pip, index) => {
            if (index % 5 === 0) acc.push([]);
            acc[acc.length - 1].push(pip);
            return acc;
          }, [])
          .sort((a, b) => a.length - b.length) // Sort arrays by length
          .map((group, index) => (
            <div key={index}>
              {group.join(' ')}
            </div>
          ))
        }
      </div>
    </div>
  )
}

class Equipment extends React.Component {
  render() {
    if (!this.props.player) return null;
    const player = this.props.player;
    const game = this.props.game;
    let equipment = [];
    let items = [];
    
    let ammoCount = 0;
    if (player?.getAmmoCountAvailable) {
      ammoCount = player.getAmmoCountAvailable();
    }

    player.equipment.forEach((slot) => {
      if (slot.item) {
        items.push({
          item: slot.item,
          equipped: true,
        });
      }
    });

    player.container.forEach((slot) => {
      if (slot.items.length) {
        const item = slot.items[0];
        const equipable = item.entityTypes.includes('EQUIPABLE');
        items.push({
          item,
          amount: slot.items.length,
          equipable,
          equipped: false,
        })
      }
    });

    items.sort((a, b) => Number(b.equipable) - Number(a.equipable))
    return (
      <div className="Equipment UI">
        {
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{flex: 1}}>
              <span className="EquipmentCard__item__label__amount">
                equipped&nbsp;
              </span>
              {
                items.map((item, index) => {
                  if (item.equipped) {
                    return (
                      <SimpleEquipmentCard
                        key={index}
                        game={game} 
                        player={player} 
                        data={item} 
                      />
                    )
                  }
                })
              }
            </div>
              <AmmoBlock ammoCount={ammoCount} />
          </div>
        }
      </div>
    );
  }
}

export default Equipment;