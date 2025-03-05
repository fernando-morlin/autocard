// src/services/ItemGenerationService.js
const { CARD_CATEGORIES, ITEM_TYPES, ITEM_CATEGORY_TYPES } = window.GameConstants;
const { weaponCardModel, armorCardModel, relicCardModel, consumableCardModel } = window.CardModels;

window.ItemGenerationService = {
  generateItem: async (description, itemCategory, creature) => {
    try {
      console.log(`Generating ${itemCategory} item for creature:`, creature.name);
      
      // Get appropriate base model
      let baseModel;
      switch (itemCategory) {
        case CARD_CATEGORIES.WEAPON:
          baseModel = weaponCardModel;
          break;
        case CARD_CATEGORIES.ARMOR:
          baseModel = armorCardModel;
          break;
        case CARD_CATEGORIES.RELIC:
          baseModel = relicCardModel;
          break;
        case CARD_CATEGORIES.CONSUMABLE:
          baseModel = consumableCardModel;
          break;
        default:
          throw new Error(`Invalid item category: ${itemCategory}`);
      }
      
      // Get available item types for the category
      const availableTypes = ITEM_CATEGORY_TYPES[itemCategory] || [];
      if (availableTypes.length === 0) {
        throw new Error(`No item types found for category: ${itemCategory}`);
      }
      
      // Enhanced prompt for item generation
      const enhancedPrompt = `
You are a creative fantasy card game designer.

Create a ${itemCategory.toLowerCase()} item card to equip on a ${creature.element} ${creature.class} creature. 
Base your design on this description: "${description}"

The creature has these stats:
Health: ${creature.health}
Power: ${creature.power}
Defense: ${creature.defense}
Agility: ${creature.agility}

Your response MUST follow this JSON format:
{
  "name": "A CREATIVE, MEMORABLE NAME IN ALL CAPS",
  "itemType": one of ${JSON.stringify(availableTypes)},
  "element": one of ["Fire", "Water", "Earth", "Air", "Light", "Shadow"],
  "rarity": [number between 1-5],
  "actionCost": [number between 0-3],
  "effectText": "Description of the item's effect in battle",
  "flavorText": "Short atmospheric quote or description",
  ${itemCategory === CARD_CATEGORIES.WEAPON ? `"powerBonus": [number between 1-10],
  "secondaryEffect": "Description of additional effect",` : ""}
  ${itemCategory === CARD_CATEGORIES.ARMOR ? `"defenseBonus": [number between 1-8],
  "agilityPenalty": [number between 0-3],` : ""}
  ${itemCategory === CARD_CATEGORIES.RELIC ? `"passiveEffect": "Description of always-active effect",
  "activatedEffect": "Description of effect when activated",` : ""}
  ${itemCategory === CARD_CATEGORIES.CONSUMABLE ? `"useEffect": "Effect when used",
  "duration": [number of rounds, or 0 for instant],` : ""}
  "compatibility": ["List of elements or classes this item works best with"]
}

Follow these rules:
1. The item should complement the creature's element and class
2. If creating an item with the same element as the creature (${creature.element}), make it provide bonuses specific to that element
3. Balance the item's power based on its action cost and rarity
4. Consider the creature's strengths and weaknesses when designing the item
5. Keep the item's effect thematically appropriate for a ${creature.class}

Return ONLY the JSON object without explanation.`;

      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-thinking-exp-01-21:generateContent?key=${window.CONFIG.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: enhancedPrompt }]
            }]
          })
        });

        if (!response.ok) {
          console.error('API error:', await response.text());
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Raw Gemini response for ${itemCategory} item:`, data);

        let itemInfo;
        try {
          const responseText = data.candidates[0].content.parts[0].text;
          const jsonStart = responseText.indexOf('{');
          const jsonEnd = responseText.lastIndexOf('}') + 1;
          if (jsonStart >= 0 && jsonEnd > 0) {
            const jsonString = responseText.substring(jsonStart, jsonEnd);
            itemInfo = JSON.parse(jsonString);
          } else {
            throw new Error("Couldn't find JSON in response");
          }
        } catch (parseError) {
          console.error(`Error parsing JSON from Gemini response for ${itemCategory} item:`, parseError);
          return await window.generateFallbackItem(description, itemCategory, creature);
        }

        // Build the item object based on our model
        const baseItem = {
          ...baseModel,
          name: itemInfo.name?.toUpperCase() || `${creature.element.toUpperCase()} ${itemCategory.toUpperCase()}`,
          cardId: `${itemCategory.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
          itemType: itemInfo.itemType || availableTypes[Math.floor(Math.random() * availableTypes.length)],
          element: itemInfo.element || creature.element,
          rarity: parseInt(itemInfo.rarity) || 3,
          rarityText: ["Common", "Uncommon", "Rare", "Very Rare", "Legendary"][parseInt(itemInfo.rarity) - 1 || 2],
          actionCost: parseInt(itemInfo.actionCost) || (itemCategory === CARD_CATEGORIES.CONSUMABLE ? 1 : 0),
          effectText: itemInfo.effectText || `This item enhances the wielder's ${creature.element} abilities.`,
          flavorText: itemInfo.flavorText || `"A perfect match for a ${creature.class}."`,
          compatibility: itemInfo.compatibility || [creature.element, creature.class],
          setId: creature.setId
        };
        
        // Add category-specific properties
        let item = baseItem;
        
        if (itemCategory === CARD_CATEGORIES.WEAPON) {
          item = {
            ...baseItem,
            powerBonus: parseInt(itemInfo.powerBonus) || Math.floor(Math.random() * 5) + 3,
            secondaryEffect: itemInfo.secondaryEffect || `Grants a bonus against ${creature.element} resistances.`
          };
        } else if (itemCategory === CARD_CATEGORIES.ARMOR) {
          item = {
            ...baseItem,
            defenseBonus: parseInt(itemInfo.defenseBonus) || Math.floor(Math.random() * 4) + 2,
            agilityPenalty: parseInt(itemInfo.agilityPenalty) || Math.floor(Math.random() * 2)
          };
        } else if (itemCategory === CARD_CATEGORIES.RELIC) {
          item = {
            ...baseItem,
            passiveEffect: itemInfo.passiveEffect || `Enhances ${creature.element} damage.`,
            activatedEffect: itemInfo.activatedEffect || `Unleashes stored ${creature.element} energy.`
          };
        } else if (itemCategory === CARD_CATEGORIES.CONSUMABLE) {
          item = {
            ...baseItem,
            useEffect: itemInfo.useEffect || `Restores health and boosts ${creature.element} power.`,
            duration: parseInt(itemInfo.duration) || 0
          };
        }

        return item;
      } catch (apiError) {
        console.error(`API call failed for ${itemCategory} item generation:`, apiError);
        return await window.generateFallbackItem(description, itemCategory, creature);
      }
    } catch (error) {
      console.error(`Error generating ${itemCategory} item card:`, error);
      throw error;
    }
  }
};

// Fallback generator in case the API fails
window.generateFallbackItem = async (description, itemCategory, creature) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const availableTypes = ITEM_CATEGORY_TYPES[itemCategory] || [];
  const itemType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
  const useCreatureElement = Math.random() > 0.3; // 70% chance to use creature's element
  
  const element = useCreatureElement ? 
    creature.element : 
    Object.values(window.GameConstants.ELEMENTS).filter(e => e !== creature.element)[
      Math.floor(Math.random() * (Object.values(window.GameConstants.ELEMENTS).length - 1))
    ];
  
  // Build a base name from item type and element
  const itemAdjectives = {
    [window.GameConstants.ELEMENTS.FIRE]: ["Blazing", "Inferno", "Molten", "Ember"],
    [window.GameConstants.ELEMENTS.WATER]: ["Tidal", "Aqua", "Frost", "Ocean"],
    [window.GameConstants.ELEMENTS.EARTH]: ["Stone", "Terra", "Mountain", "Crystal"],
    [window.GameConstants.ELEMENTS.AIR]: ["Zephyr", "Wind", "Sky", "Cloud"],
    [window.GameConstants.ELEMENTS.LIGHT]: ["Radiant", "Solar", "Divine", "Celestial"],
    [window.GameConstants.ELEMENTS.SHADOW]: ["Void", "Umbral", "Night", "Twilight"]
  };
  
  const adjective = itemAdjectives[element][Math.floor(Math.random() * itemAdjectives[element].length)];
  const itemName = `${adjective} ${itemType}`.toUpperCase();
  
  // Category-specific properties
  let specificProps = {};
  
  switch (itemCategory) {
    case CARD_CATEGORIES.WEAPON:
      specificProps = {
        powerBonus: Math.floor(Math.random() * 5) + 3,
        secondaryEffect: `Grants +${Math.floor(Math.random() * 3) + 1} bonus against ${element} resistances.`
      };
      break;
    case CARD_CATEGORIES.ARMOR:
      specificProps = {
        defenseBonus: Math.floor(Math.random() * 4) + 2,
        agilityPenalty: Math.min(Math.floor(Math.random() * 3), itemType === ITEM_TYPES.HEAVY ? 2 : 1)
      };
      break;
    case CARD_CATEGORIES.RELIC:
      specificProps = {
        passiveEffect: `Enhances ${element} resistance by ${Math.floor(Math.random() * 20) + 10}%.`,
        activatedEffect: `Once per battle: Unleash stored ${element} energy to deal ${Math.floor(Math.random() * 10) + 5} damage.`
      };
      break;
    case CARD_CATEGORIES.CONSUMABLE:
      specificProps = {
        useEffect: `Restores ${Math.floor(Math.random() * 10) + 5} health and temporarily boosts ${element} power.`,
        duration: Math.floor(Math.random() * 3)
      };
      break;
  }
  
  // Get appropriate base model
  let baseModel;
  switch (itemCategory) {
    case CARD_CATEGORIES.WEAPON:
      baseModel = window.CardModels.weaponCardModel;
      break;
    case CARD_CATEGORIES.ARMOR:
      baseModel = window.CardModels.armorCardModel;
      break;
    case CARD_CATEGORIES.RELIC:
      baseModel = window.CardModels.relicCardModel;
      break;
    case CARD_CATEGORIES.CONSUMABLE:
      baseModel = window.CardModels.consumableCardModel;
      break;
    default:
      baseModel = window.CardModels.itemCardModel;
  }
  
  return {
    ...baseModel,
    name: itemName,
    cardId: `${itemCategory.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
    itemType: itemType,
    element: element,
    rarity: Math.floor(Math.random() * 3) + 2,
    rarityText: ["Uncommon", "Rare", "Very Rare"][Math.floor(Math.random() * 3)],
    actionCost: itemCategory === CARD_CATEGORIES.CONSUMABLE ? 1 : 0,
    effectText: `This ${element} ${itemType.toLowerCase()} ${
      itemCategory === CARD_CATEGORIES.WEAPON ? `increases attack power and deals extra damage against ${window.GameConstants.OPPOSING_ELEMENTS[element]} enemies.` :
      itemCategory === CARD_CATEGORIES.ARMOR ? `provides protection from physical attacks and reduces damage from ${window.GameConstants.OPPOSING_ELEMENTS[element]} sources.` :
      itemCategory === CARD_CATEGORIES.RELIC ? `enhances ${element} abilities and provides resistance against opposing elements.` :
      `can be used in battle to provide a temporary boost to ${element} abilities.`
    }`,
    flavorText: `"Forged in the essence of ${element}, a valuable asset for any ${creature.class}."`,
    compatibility: [element, creature.class],
    setId: creature.setId,
    ...specificProps
  };
};