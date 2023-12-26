import React from 'react';
import {
  GiCrosshair,
  GiBullets,
  GiBarbedArrow,
  GiBurningDot,
} from "react-icons/gi";
import {EquipItemFromContainer} from '../../Actions/EquipItemFromContainer';
import {STAT_RENDERERS} from '../../Modes/Jacinto/theme';

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

  let onClick = game.refocus();
  if (equipable) {
    const action = new EquipItemFromContainer({
      item,
      game,
      energyCost: 0,
      actor: player,
      label: `Equip ${item.name}`,
    });
    onClick = () => {
      game.refocus();
      action.immediatelyExecuteAction();
    }
  }

  let needsReload = false;
  if (item.hasOwnProperty('magazine')) {
    if (item.magazine <= 0) {
      needsReload = true;
    }
  }

  return (
    <div 
      className={`SimpleEquipmentCard EquipmentCard ${equipped ? 'EquipmentCard--selected' : ''} ${equipable ? 'EquipmentCard--equipable': ''}`} 
      onClick={onClick}
    >
      <div className="EquipmentCard__item">
        <div className="EquipmentCard__item__label--simple">
          <span className="EquipmentCard__item__label__amount">
            {equipable && 'equip'} {(amount || 1)}&nbsp;
          </span>
          <span>{item.name}&nbsp;</span>
          <span style={{color: '#6d7886'}}>{needsReload && '(reload)'}</span>
        </div>
      </div>
    </div>
  )
}

const EquipmentCard = (props) => {
  const {
    game,
    player,
    data,
  } = props;
  const {
    item,
    equipped,
    amount,
    equipable,
  } = data;

  let needsReload = false;

  let onClick = () => game.refocus();
  if (equipable) {
    const action = new EquipItemFromContainer({
      item,
      game,
      energyCost: 0,
      actor: player,
      label: `Equip ${item.name}`,
    });
    onClick = () => {
      game.refocus();
      action.immediatelyExecuteAction();
    }
  }

  let stats = [];
  if (amount) {
    stats.push({
      name: 'amount left',
      value: amount,
      renderer: STAT_RENDERERS.amount,
    })
  }
  if (item.hasOwnProperty('attackRange')) {
    stats.push({
      name: 'attack range',
      abbreviatedName: 'range',
      value: item['attackRange'],
      renderer: STAT_RENDERERS.attackRange,
      getIcon: () => <GiBarbedArrow />,
    })
  }
  if (item.hasOwnProperty('baseRangedDamage')) {
    stats.push({
      name: 'base damage',
      abbreviatedName: 'ranged dmg',
      value: item['baseRangedDamage'],
      renderer: STAT_RENDERERS.baseRangedDamage,
      getIcon: () => <GiBurningDot />,
    })
  }
  
  return (
    <div 
      className={`EquipmentCard ${equipped ? 'EquipmentCard--selected' : ''}`} 
      onClick={onClick}
    >
      {needsReload && (
        <div className="EquipmentCard__reload_overlay">
          <div className="EquipmentCard__reload_overlay__text">Reload</div>
        </div>
      )}
      <div className="EquipmentCard__item">
        <div className="EquipmentCard__item__content" style={item.renderer && {
          backgroundColor: item.renderer.background,
          color: item.renderer.color,
          borderColor: item.renderer.color,
        }}>
          {item.renderer.sprite ? item.renderer.sprite : item.renderer.character}
        </div>
        <div className="EquipmentCard__item__label">
          {item.name}
        </div>
      </div>
      <div className="EquipmentCard__item__stats">
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
              {
                items.map((item, index) => {
                  if (item.equipped) {
                    return (
                      <EquipmentCard 
                        key={index}
                        game={game} 
                        player={player} 
                        data={item} 
                      />
                    )
                  } else {
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
          </div>
        }
      </div>
    );
  }
}

export default Equipment;