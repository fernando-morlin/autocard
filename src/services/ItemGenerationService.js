const { CARD_CATEGORIES, ITEM_TYPES, ITEM_CATEGORY_TYPES } = window.GameConstants;
const { weaponCardModel, armorCardModel, relicCardModel, consumableCardModel } = window.CardModels;

window.ItemGenerationService = {
  generateItem: async (description, itemCategory, creature, userDescription = "") => {
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

        // Generate image for the item (implementation from first snippet)
        try {
          const imageUrl = await window.ImageGenerationService.generateItemImage(item, userDescription);
          item.imageUrl = imageUrl;
        } catch (imageError) {
          console.error(`Error generating ${itemCategory} image:`, imageError);
          item.imageUrl = window.getPlaceholderImage(item.name);
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

// Fallback generator remains unchanged
window.generateFallbackItem = async (description, itemCategory, creature) => {
  // ... (original fallback generator code remains the same) ...
};