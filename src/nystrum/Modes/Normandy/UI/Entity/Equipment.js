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
  if (item.hasOwnProperty('magazine')) {
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
          <span>{item.name}&nbsp;</span>
          <span style={{color: '#6d7886'}}>{needsReload && '(reload)'}</span>
          <div className="EquipmentCard__item__stats" style={{marginLeft: 10}}>
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
          </div>
        </div>
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
          <div>
            <div>
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
              {/* <hr />
              {
                items.map((item, index) => {
                  if (!item.equipped) {
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
              } */}
            </div>
          </div>
        }
      </div>
    );
  }
}

export default Equipment;