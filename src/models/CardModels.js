// src/models/CardModels.js
const { CARD_CATEGORIES, ELEMENTS, CLASSES, ITEM_TYPES } = window.GameConstants;

// Base card model shared by all card types
const baseCardModel = {
  name: "",
  cardId: "",
  element: "",
  rarity: 0,
  rarityText: "",
  flavorText: "",
  setId: ""
};

// Creature-specific model
const creatureCardModel = {
  ...baseCardModel,
  cardCategory: CARD_CATEGORIES.CREATURE,
  class: "",
  health: 0,
  power: 0,
  defense: 0,
  agility: 0,
  specialAbilities: []
};

// Item base model
const itemCardModel = {
  ...baseCardModel,
  itemType: "",
  effectText: "",
  actionCost: 0,
  compatibility: []
};

// Weapon model
const weaponCardModel = {
  ...itemCardModel,
  cardCategory: CARD_CATEGORIES.WEAPON,
  powerBonus: 0,
  secondaryEffect: ""
};

// Armor model
const armorCardModel = {
  ...itemCardModel,
  cardCategory: CARD_CATEGORIES.ARMOR,
  defenseBonus: 0,
  agilityPenalty: 0
};

// Relic model
const relicCardModel = {
  ...itemCardModel,
  cardCategory: CARD_CATEGORIES.RELIC,
  passiveEffect: "",
  activatedEffect: ""
};

// Consumable model
const consumableCardModel = {
  ...itemCardModel,
  cardCategory: CARD_CATEGORIES.CONSUMABLE,
  useEffect: "",
  duration: 0
};

// Card set model
const cardSetModel = {
  creature: null,
  items: [],
  isValid: false,
  validationMessages: []
};

// Export all models
window.CardModels = {
  baseCardModel,
  creatureCardModel,
  itemCardModel,
  weaponCardModel,
  armorCardModel,
  relicCardModel,
  consumableCardModel,
  cardSetModel
};