const CardSetDisplay = ({ cardSet, isGenerating }) => {
  if (!cardSet && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-white text-center">
        <p className="text-lg mb-2">No Card Set Generated Yet</p>
        <p className="text-sm text-gray-300">Enter a description and click Generate</p>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-white text-center animate-pulse">
        <div className="text-yellow-300 mb-2">Generating Card Set...</div>
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  // Helper function to render image with loading state
  const renderCardImage = (imageUrl, name, size = "h-48") => {
    if (!imageUrl) {
      return (
        <div className={`w-full ${size} bg-gray-800 flex items-center justify-center animate-pulse`}>
          <div className="text-yellow-300 text-sm">Generating image...</div>
        </div>
      );
    }
    
    return (
      <img 
        src={imageUrl} 
        alt={name}
        className={`w-full ${size} object-cover`}
        style={{
          background: 'linear-gradient(to bottom, #1a202c, #2d3748)'
        }}
      />
    );
  };

  const { creature, items, isValid, validationMessages } = cardSet;
  const effectiveStats = window.CardSetUtils.calculateEffectiveStats(creature, items);

  return (
    <div className="w-full">
      <div className="bg-gradient-to-b from-gray-900 to-blue-900 border-2 border-yellow-300 rounded-lg p-4 shadow-lg">
        {/* Validation messages */}
        {validationMessages && validationMessages.length > 0 && (
          <div className={`mb-4 p-3 border rounded-md ${isValid ? 'border-green-500 bg-green-900 bg-opacity-20' : 'border-red-500 bg-red-900 bg-opacity-20'}`}>
            <h3 className={`text-sm font-bold mb-1 ${isValid ? 'text-green-400' : 'text-red-400'}`}>
              {isValid ? 'Valid Card Set' : 'Invalid Card Set - Please Regenerate'}
            </h3>
            <ul className="text-xs space-y-1">
              {validationMessages.map((msg, idx) => (
                <li key={idx} className="text-gray-300">{msg}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Creature section - Updated with image */}
        <div className="mb-6">
          <h2 className="text-yellow-300 text-lg font-bold mb-2 border-b border-yellow-500 pb-1">
            {creature.name} - {creature.element} {creature.class}
          </h2>
          
          <div className="flex flex-col md:flex-row gap-4">
            {/* Creature card display with image */}
            <div className="w-full md:w-1/3">
              <div className="relative bg-gradient-to-br from-blue-900 to-purple-900 border-2 border-yellow-300 rounded-lg overflow-hidden shadow-lg p-3">
                {/* Creature Image */}
                <div className="relative w-full h-48 md:h-64 mb-3 rounded-lg overflow-hidden">
                  {renderCardImage(creature.imageUrl, creature.name, "h-full")}
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <div className="bg-black bg-opacity-60 px-2 py-1 rounded text-sm">
                    <span className="text-yellow-300">{creature.element}</span>
                  </div>
                  <div className="flex">
                    {Array.from({ length: creature.rarity }).map((_, idx) => (
                      <div key={idx} className="text-yellow-300">★</div>
                    ))}
                  </div>
                  <div className="bg-black bg-opacity-60 px-2 py-1 rounded text-sm">
                    <span className="text-yellow-300">{creature.class}</span>
                  </div>
                </div>
                
                <div className="text-white text-xl font-bold text-center mb-2">{creature.name}</div>
                
                <div className="flex justify-between text-sm text-white bg-black bg-opacity-40 p-2 rounded mb-2">
                  <div><span className="text-red-400">HP:</span> {creature.health}</div>
                  <div><span className="text-yellow-400">PWR:</span> {creature.power}</div>
                  <div><span className="text-blue-400">DEF:</span> {creature.defense}</div>
                  <div><span className="text-green-400">AGL:</span> {creature.agility}</div>
                </div>
                
                <div className="text-white text-sm mb-2">
                  <div className="bg-black bg-opacity-60 p-2 rounded mb-1">
                    <div className="text-yellow-300 text-xs mb-1">Effect:</div>
                    <div>{creature.effectText}</div>
                  </div>
                  
                  {creature.specialAbilities && creature.specialAbilities.length > 0 && (
                    <div className="bg-black bg-opacity-60 p-2 rounded">
                      <div className="text-yellow-300 text-xs mb-1">Special Abilities:</div>
                      {creature.specialAbilities.map((ability, idx) => (
                        <div key={idx} className="mb-1">
                          <span className="text-yellow-300">{ability.name}</span> (Cost: {ability.actionCost}) - {ability.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="text-gray-300 text-xs italic">"{creature.flavorText}"</div>
              </div>
            </div>
            
            {/* Creature stats with item bonuses */}
            <div className="w-full md:w-2/3">
              <h3 className="text-white text-md font-bold mb-2">Effective Stats with Equipment</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded p-2">
                  <div className="text-xs text-red-400">Health</div>
                  <div className="text-white text-lg font-bold">{effectiveStats?.health || creature.health}</div>
                </div>
                <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded p-2">
                  <div className="text-xs text-yellow-400">Power</div>
                  <div className="text-white text-lg font-bold">{effectiveStats?.power || creature.power}</div>
                </div>
                <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded p-2">
                  <div className="text-xs text-blue-400">Defense</div>
                  <div className="text-white text-lg font-bold">{effectiveStats?.defense || creature.defense}</div>
                </div>
                <div className="bg-green-900 bg-opacity-30 border border-green-700 rounded p-2">
                  <div className="text-xs text-green-400">Agility</div>
                  <div className="text-white text-lg font-bold">{effectiveStats?.agility || creature.agility}</div>
                </div>
              </div>
              {effectiveStats?.bonuses && effectiveStats.bonuses.length > 0 && (
                <div className="bg-black bg-opacity-30 border border-gray-700 rounded p-2 mb-4">
                  <div className="text-xs text-gray-400 mb-1">Item Bonuses:</div>
                  <ul className="text-sm text-white">
                    {effectiveStats.bonuses.map((bonus, idx) => (
                      <li key={idx}>{bonus}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="text-sm text-white">
                <div className="bg-black bg-opacity-30 border border-gray-700 rounded p-2">
                  <div className="text-xs text-gray-400 mb-1">Battle Information:</div>
                  <div className="mb-1">
                    <span className="text-yellow-300">Class Role:</span> {
                      creature.class === window.GameConstants.CLASSES.GUARDIAN ? "Defensive tank, can intercept attacks" :
                      creature.class === window.GameConstants.CLASSES.HUNTER ? "Offensive damage dealer with critical bonuses" :
                      creature.class === window.GameConstants.CLASSES.MYSTIC ? "Magical controller with multi-target abilities" :
                      "Utility trickster with status effects and turn manipulation"
                    }
                  </div>
                  <div className="mb-1">
                    <span className="text-yellow-300">Elemental Advantage:</span> Strong against {window.GameConstants.OPPOSING_ELEMENTS[creature.element]}
                  </div>
                  <div>
                    <span className="text-yellow-300">Complementary:</span> Pairs well with {window.GameConstants.COMPLEMENTARY_ELEMENTS[creature.element]} creatures
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items section - Updated with images */}
        <div>
          <h2 className="text-yellow-300 text-lg font-bold mb-2 border-b border-yellow-500 pb-1">
            Equipped Items
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, idx) => {
              const compatibility = window.CardSetUtils.isItemCompatibleWithCreature(creature, item);
              let bgColor;
              switch(item.cardCategory) {
                case CARD_CATEGORIES.WEAPON:
                  bgColor = "from-red-900 to-red-700";
                  break;
                case CARD_CATEGORIES.ARMOR:
                  bgColor = "from-blue-900 to-blue-700";
                  break;
                case CARD_CATEGORIES.RELIC:
                  bgColor = "from-purple-900 to-purple-700";
                  break;
                case CARD_CATEGORIES.CONSUMABLE:
                  bgColor = "from-green-900 to-green-700";
                  break;
                default:
                  bgColor = "from-gray-900 to-gray-700";
              }
              
              return (
                <div key={idx} className={`bg-gradient-to-br ${bgColor} border-2 border-yellow-300 rounded-lg overflow-hidden shadow-lg p-3 relative`}>
                  {/* Item Image */}
                  <div className="relative w-full h-32 mb-2 rounded-lg overflow-hidden">
                    {renderCardImage(item.imageUrl, item.name, "h-full")}
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <div className="bg-black bg-opacity-60 px-2 py-1 rounded text-xs">
                      <span className="text-yellow-300">{item.element}</span>
                    </div>
                    <div className="flex">
                      {Array.from({ length: item.rarity }).map((_, idx) => (
                        <div key={idx} className="text-yellow-300">★</div>
                      ))}
                    </div>
                    <div className="bg-black bg-opacity-60 px-2 py-1 rounded text-xs">
                      <span className="text-yellow-300">{item.itemType}</span>
                    </div>
                  </div>
                  
                  <div className="text-white text-md font-bold text-center mb-2">{item.name}</div>
                  
                  <div className="flex justify-between text-xs text-white bg-black bg-opacity-40 p-2 rounded mb-2">
                    <div className="capitalize">{item.cardCategory}</div>
                    {item.actionCost > 0 && (
                      <div><span className="text-yellow-400">Cost:</span> {item.actionCost} AP</div>
                    )}
                  </div>
                  
                  <div className="text-white text-xs mb-2">
                    <div className="bg-black bg-opacity-60 p-2 rounded mb-1">
                      <div>{item.effectText}</div>
                    </div>
                    
                    {item.cardCategory === CARD_CATEGORIES.WEAPON && (
                      <div className="bg-black bg-opacity-60 p-2 rounded mb-1">
                        <div><span className="text-yellow-300">Power Bonus:</span> +{item.powerBonus}</div>
                        <div><span className="text-yellow-300">Effect:</span> {item.secondaryEffect}</div>
                      </div>
                    )}
                    
                    {item.cardCategory === CARD_CATEGORIES.ARMOR && (
                      <div className="bg-black bg-opacity-60 p-2 rounded mb-1">
                        <div><span className="text-yellow-300">Defense Bonus:</span> +{item.defenseBonus}</div>
                        <div><span className="text-yellow-300">Agility Penalty:</span> -{item.agilityPenalty}</div>
                      </div>
                    )}
                    
                    {item.cardCategory === CARD_CATEGORIES.RELIC && (
                      <div className="bg-black bg-opacity-60 p-2 rounded mb-1">
                        <div><span className="text-yellow-300">Passive:</span> {item.passiveEffect}</div>
                        <div><span className="text-yellow-300">Activated:</span> {item.activatedEffect}</div>
                      </div>
                    )}
                    
                    {item.cardCategory === CARD_CATEGORIES.CONSUMABLE && (
                      <div className="bg-black bg-opacity-60 p-2 rounded mb-1">
                        <div><span className="text-yellow-300">Effect:</span> {item.useEffect}</div>
                        <div><span className="text-yellow-300">Duration:</span> {item.duration === 0 ? "Instant" : `${item.duration} turns`}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className={`text-xs p-1 rounded mb-1 text-center ${compatibility.compatible ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {compatibility.compatible ? 
                      (compatibility.bonus > 0 ? `+${compatibility.bonus * 100}% ${compatibility.reason}` : compatibility.reason) :
                      compatibility.reason
                    }
                  </div>
                  
                  <div className="text-gray-300 text-xs italic">"{item.flavorText}"</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

window.CardSetDisplay = CardSetDisplay;