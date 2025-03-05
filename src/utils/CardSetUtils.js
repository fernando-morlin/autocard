// src/utils/CardSetUtils.js
const { CARD_CATEGORIES, OPPOSING_ELEMENTS, CLASS_ITEM_COMPATIBILITY, ITEM_CATEGORY_TYPES } = window.GameConstants;

window.CardSetUtils = {
  // Check if an item is compatible with a creature
  isItemCompatibleWithCreature: (creature, item) => {
    if (!creature || !item) return false;
    
    // Check element compatibility
    if (item.element === creature.element) {
      // Same element: 25% bonus
      return { compatible: true, bonus: 0.25, reason: "Same element (+25% effect)" };
    } else if (OPPOSING_ELEMENTS[creature.element] === item.element) {
      // Opposing element: 10% self-damage
      return { compatible: false, penalty: 0.1, reason: "Opposing element (10% self-damage)" };
    }
    
    // Check class compatibility
    const preferredItemTypes = CLASS_ITEM_COMPATIBILITY[creature.class] || [];
    if (preferredItemTypes.includes(item.itemType)) {
      return { compatible: true, bonus: 0.2, reason: `${creature.class} works well with ${item.itemType}` };
    }
    
    // No special compatibility, but not opposing
    return { compatible: true, bonus: 0, reason: "Basic compatibility" };
  },
  
  // Check if a complete set is valid
  validateCardSet: (cardSet) => {
    const { creature, items } = cardSet;
    const validationMessages = [];
    let isValid = true;
    
    // Check if we have a creature and 4 items
    if (!creature) {
      validationMessages.push("Missing creature card");
      isValid = false;
    }
    
    if (!items || items.length !== 4) {
      validationMessages.push("Set must contain exactly 4 items");
      isValid = false;
    }
    
    if (!isValid) {
      return { isValid, validationMessages };
    }
    
    // Check item categories
    const categories = items.map(item => item.cardCategory);
    const uniqueCategories = [...new Set(categories)];
    
    if (uniqueCategories.length < 3) {
      validationMessages.push("Items must belong to at least 3 different categories");
      isValid = false;
    }
    
    // Check for weapon
    if (!categories.includes(CARD_CATEGORIES.WEAPON)) {
      validationMessages.push("Set must include at least one weapon");
      isValid = false;
    }
    
    // Check for defensive item (armor or defensive relic)
    if (!categories.includes(CARD_CATEGORIES.ARMOR)) {
      validationMessages.push("Set must include at least one armor item");
      isValid = false;
    }
    
    // Check for duplicate item types
    const itemTypes = items.map(item => item.itemType);
    if (new Set(itemTypes).size !== itemTypes.length) {
      validationMessages.push("No duplicate item types allowed");
      isValid = false;
    }
    
    // Check elemental alignment
    const elementAlignedItems = items.filter(item => item.element === creature.element);
    if (elementAlignedItems.length < 2) {
      validationMessages.push("At least 2 items should match the creature's element");
      isValid = false;
    }
    
    return { isValid, validationMessages };
  },
  
  // Calculate effective stats based on equipped items
  calculateEffectiveStats: (creature, items) => {
    if (!creature || !items) return null;
    
    // Start with base stats
    const effectiveStats = {
      health: creature.health,
      power: creature.power,
      defense: creature.defense,
      agility: creature.agility,
      bonuses: []
    };
    
    // Apply item bonuses
    items.forEach(item => {
      const compatibility = window.CardSetUtils.isItemCompatibleWithCreature(creature, item);
      
      // Add appropriate bonuses based on item type
      if (item.cardCategory === CARD_CATEGORIES.WEAPON) {
        const bonus = item.powerBonus * (1 + (compatibility.compatible ? compatibility.bonus || 0 : 0));
        effectiveStats.power += bonus;
        effectiveStats.bonuses.push(`${item.name}: +${bonus.toFixed(1)} Power`);
      }
      
      if (item.cardCategory === CARD_CATEGORIES.ARMOR) {
        const bonus = item.defenseBonus * (1 + (compatibility.compatible ? compatibility.bonus || 0 : 0));
        effectiveStats.defense += bonus;
        effectiveStats.agility -= item.agilityPenalty;
        effectiveStats.bonuses.push(`${item.name}: +${bonus.toFixed(1)} Defense, -${item.agilityPenalty} Agility`);
      }
      
      // Other item effects would be handled here
    });
    
    return effectiveStats;
  }
};