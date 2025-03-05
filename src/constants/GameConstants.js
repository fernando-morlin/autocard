// src/constants/GameConstants.js
const ELEMENTS = {
    FIRE: "Fire",
    WATER: "Water",
    EARTH: "Earth",
    AIR: "Air",
    LIGHT: "Light",
    SHADOW: "Shadow"
  };
  
  const CLASSES = {
    GUARDIAN: "Guardian",
    HUNTER: "Hunter",
    MYSTIC: "Mystic",
    TRICKSTER: "Trickster"
  };
  
  const CARD_CATEGORIES = {
    CREATURE: "Creature",
    WEAPON: "Weapon",
    ARMOR: "Armor",
    RELIC: "Relic",
    CONSUMABLE: "Consumable"
  };
  
  const ITEM_TYPES = {
    // Weapons
    BLADE: "Blade",
    STAFF: "Staff",
    BOW: "Bow",
    SHIELD: "Shield",
    
    // Armor
    LIGHT: "Light",
    MEDIUM: "Medium",
    HEAVY: "Heavy",
    
    // Relics
    CHARM: "Charm",
    TALISMAN: "Talisman",
    CRYSTAL: "Crystal",
    ARTIFACT: "Artifact",
    
    // Consumables
    POTION: "Potion",
    SCROLL: "Scroll",
    ELIXIR: "Elixir",
    TONIC: "Tonic"
  };
  
  // Opposing elements relationship
  const OPPOSING_ELEMENTS = {
    [ELEMENTS.FIRE]: ELEMENTS.WATER,
    [ELEMENTS.WATER]: ELEMENTS.FIRE,
    [ELEMENTS.EARTH]: ELEMENTS.AIR,
    [ELEMENTS.AIR]: ELEMENTS.EARTH,
    [ELEMENTS.LIGHT]: ELEMENTS.SHADOW,
    [ELEMENTS.SHADOW]: ELEMENTS.LIGHT
  };
  
  // Complementary elements
  const COMPLEMENTARY_ELEMENTS = {
    [ELEMENTS.FIRE]: ELEMENTS.AIR,
    [ELEMENTS.AIR]: ELEMENTS.FIRE,
    [ELEMENTS.WATER]: ELEMENTS.EARTH,
    [ELEMENTS.EARTH]: ELEMENTS.WATER,
    [ELEMENTS.LIGHT]: ELEMENTS.SHADOW,
    [ELEMENTS.SHADOW]: ELEMENTS.LIGHT
  };
  
  // Class-Item compatibility bonuses
  const CLASS_ITEM_COMPATIBILITY = {
    [CLASSES.GUARDIAN]: [ITEM_TYPES.SHIELD, ITEM_TYPES.HEAVY],
    [CLASSES.HUNTER]: [ITEM_TYPES.BOW, ITEM_TYPES.BLADE],
    [CLASSES.MYSTIC]: [ITEM_TYPES.STAFF, ITEM_TYPES.CRYSTAL, ITEM_TYPES.ARTIFACT],
    [CLASSES.TRICKSTER]: [ITEM_TYPES.LIGHT, ITEM_TYPES.CHARM, ITEM_TYPES.TONIC]
  };
  
  // Item category mappings
  const ITEM_CATEGORY_TYPES = {
    [CARD_CATEGORIES.WEAPON]: [ITEM_TYPES.BLADE, ITEM_TYPES.STAFF, ITEM_TYPES.BOW, ITEM_TYPES.SHIELD],
    [CARD_CATEGORIES.ARMOR]: [ITEM_TYPES.LIGHT, ITEM_TYPES.MEDIUM, ITEM_TYPES.HEAVY],
    [CARD_CATEGORIES.RELIC]: [ITEM_TYPES.CHARM, ITEM_TYPES.TALISMAN, ITEM_TYPES.CRYSTAL, ITEM_TYPES.ARTIFACT],
    [CARD_CATEGORIES.CONSUMABLE]: [ITEM_TYPES.POTION, ITEM_TYPES.SCROLL, ITEM_TYPES.ELIXIR, ITEM_TYPES.TONIC]
  };
  
  // Export all constants
  window.GameConstants = {
    ELEMENTS,
    CLASSES,
    CARD_CATEGORIES,
    ITEM_TYPES,
    OPPOSING_ELEMENTS,
    COMPLEMENTARY_ELEMENTS,
    CLASS_ITEM_COMPATIBILITY,
    ITEM_CATEGORY_TYPES
  };