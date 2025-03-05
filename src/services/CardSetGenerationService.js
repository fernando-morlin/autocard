const { CARD_CATEGORIES } = window.GameConstants;

window.CardSetGenerationService = {
  generateCardSet: async (description) => {
    try {
      console.log("Generating complete card set for:", description);
      
      // Step 1: Generate the creature
      const creature = await window.CreatureGenerationService.generateCreature(description);
      creature.userDescription = description; // Add user description to creature
      console.log("Generated creature:", creature);
      
      // Step 2: Determine item categories to generate
      // We always need at least one weapon and one armor
      const requiredCategories = [CARD_CATEGORIES.WEAPON, CARD_CATEGORIES.ARMOR];
      
      // For the remaining two items, choose based on the creature's class
      const optionalCategories = [CARD_CATEGORIES.RELIC, CARD_CATEGORIES.CONSUMABLE];
      
      // If the creature is a Mystic, prioritize relics
      if (creature.class === window.GameConstants.CLASSES.MYSTIC) {
        optionalCategories.reverse();
      }
      
      // Create the final category list
      const itemCategories = [...requiredCategories];
      
      // Add the remaining categories
      for (const category of optionalCategories) {
        if (itemCategories.length < 4) {
          itemCategories.push(category);
        }
      }
      
      // If we still don't have 4 items, duplicate a category (prefer weapon or relic)
      while (itemCategories.length < 4) {
        if (creature.class === window.GameConstants.CLASSES.HUNTER) {
          itemCategories.push(CARD_CATEGORIES.WEAPON);
        } else if (creature.class === window.GameConstants.CLASSES.MYSTIC) {
          itemCategories.push(CARD_CATEGORIES.RELIC);
        } else {
          itemCategories.push(CARD_CATEGORIES.CONSUMABLE);
        }
      }
      
      // Step 3: Generate the items in parallel for efficiency
      console.log("Generating items with categories:", itemCategories);
      const itemPromises = [];
      const usedItemTypes = new Set();
      
      for (const category of itemCategories) {
        // Generate item description based on creature and category
        let itemDescription;
        switch (category) {
          case CARD_CATEGORIES.WEAPON:
            itemDescription = `a powerful ${creature.element} weapon for a ${creature.class}`;
            break;
          case CARD_CATEGORIES.ARMOR:
            itemDescription = `protective armor with ${creature.element} resistance for a ${creature.class}`;
            break;
          case CARD_CATEGORIES.RELIC:
            itemDescription = `a magical ${creature.element} relic that enhances ${creature.class} abilities`;
            break;
          case CARD_CATEGORIES.CONSUMABLE:
            itemDescription = `a ${creature.element} potion or scroll that provides temporary power`;
            break;
          default:
            itemDescription = `an item for a ${creature.element} ${creature.class}`;
        }
        
        // Add item generation to promises array
        itemPromises.push(
          (async () => {
            let item;
            let attempts = 0;
            const maxAttempts = 3;
            
            while (attempts < maxAttempts) {
              item = await window.ItemGenerationService.generateItem(itemDescription, category, creature, description);
              
              // Check if this item type is already used
              if (!usedItemTypes.has(item.itemType)) {
                usedItemTypes.add(item.itemType);
                return item;
              }
              
              attempts++;
              if (attempts === maxAttempts) {
                console.warn(`Could not generate a unique item type after ${maxAttempts} attempts for category ${category}`);
                const availableTypes = window.GameConstants.ITEM_CATEGORY_TYPES[category].filter(
                  type => !usedItemTypes.has(type)
                );
                
                if (availableTypes.length > 0) {
                  // Override the item type with an unused one
                  item.itemType = availableTypes[0];
                  usedItemTypes.add(item.itemType);
                }
                return item;
              }
            }
            
            return item;
          })()
        );
      }
      
      // Await all item generation
      const items = await Promise.all(itemPromises);
      
      // Step 4: Create and validate the card set
      const cardSet = {
        creature,
        items,
        ...window.CardSetUtils.validateCardSet({ creature, items })
      };
      
      console.log("Generated card set:", cardSet);
      return cardSet;
    } catch (error) {
      console.error("Error generating card set:", error);
      throw error;
    }
  }
};