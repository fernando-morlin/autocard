// src/services/ImageGenerationService.js
window.ImageGenerationService = {
    generateCreatureImage: async (creature) => {
      try {
        console.log("Generating image for creature:", creature.name);
  
        const elementVisuals = {
          [window.GameConstants.ELEMENTS.FIRE]: "with flames, ember effects, red-orange color scheme",
          [window.GameConstants.ELEMENTS.WATER]: "with water effects, flowing liquid, blue color scheme",
          [window.GameConstants.ELEMENTS.EARTH]: "with rocks, crystal elements, brown-green color scheme",
          [window.GameConstants.ELEMENTS.AIR]: "with wind effects, cloud elements, light blue-white color scheme",
          [window.GameConstants.ELEMENTS.LIGHT]: "with glowing aura, holy symbols, gold-white color scheme",
          [window.GameConstants.ELEMENTS.SHADOW]: "with dark essence, shadowy effects, purple-black color scheme"
        };
  
        const classVisuals = {
          [window.GameConstants.CLASSES.GUARDIAN]: "heavily armored, defensive stance, protective",
          [window.GameConstants.CLASSES.HUNTER]: "wielding weapons, aggressive stance, ready to attack",
          [window.GameConstants.CLASSES.MYSTIC]: "with magical elements, spell-casting, mystical aura",
          [window.GameConstants.CLASSES.TRICKSTER]: "agile, cunning appearance, unconventional weapons"
        };
  
        const elementStyle = elementVisuals[creature.element] || "";
        const classStyle = classVisuals[creature.class] || "";
  
        const enhancedPrompt = `A high-quality trading card game artwork depicting a ${creature.element} ${creature.class} creature: ${creature.name}. 
        ${elementStyle}. ${classStyle}. 
        The creature should be centrally composed with rich detail and appropriate for a portrait card format.
        Include suitable background elements that enhance the ${creature.element} theme.
        Art only - NO TEXT, NO CARD FRAMES, NO NUMBERS, NO SYMBOLS overlaid on the image.`;
  
        return await window.ApiService.generateImage(enhancedPrompt);
      } catch (error) {
        console.error('Error generating creature image:', error);
        return window.getPlaceholderImage(creature.name + " " + creature.element);
      }
    },
  
    generateItemImage: async (item) => {
      try {
        console.log(`Generating image for ${item.cardCategory} item:`, item.name);
  
        const elementVisuals = {
          [window.GameConstants.ELEMENTS.FIRE]: "with flames, ember effects, red-orange glow",
          [window.GameConstants.ELEMENTS.WATER]: "with water effects, flowing liquid, blue glow",
          [window.GameConstants.ELEMENTS.EARTH]: "with rocks, crystal elements, brown-green accents",
          [window.GameConstants.ELEMENTS.AIR]: "with wind effects, cloud elements, light blue-white aura",
          [window.GameConstants.ELEMENTS.LIGHT]: "with glowing aura, holy symbols, gold-white radiance",
          [window.GameConstants.ELEMENTS.SHADOW]: "with dark essence, shadowy effects, purple-black aura"
        };
  
        const categoryVisuals = {
          [window.GameConstants.CARD_CATEGORIES.WEAPON]: "detailed weapon design, combat-ready, powerful",
          [window.GameConstants.CARD_CATEGORIES.ARMOR]: "protective gear, defensive equipment, sturdy design",
          [window.GameConstants.CARD_CATEGORIES.RELIC]: "mystical artifact, ancient design, magical glow",
          [window.GameConstants.CARD_CATEGORIES.CONSUMABLE]: "potion, scroll or magical item, ready to use"
        };
  
        const elementStyle = elementVisuals[item.element] || "";
        const categoryStyle = categoryVisuals[item.cardCategory] || "";
        
        const itemTypeDescription = item.itemType ? `${item.itemType.toLowerCase()} type ` : "";
  
        const enhancedPrompt = `A high-quality trading card game artwork depicting a ${item.element} ${itemTypeDescription}${item.cardCategory.toLowerCase()}: ${item.name}. 
        ${elementStyle}. ${categoryStyle}. 
        The item should be centrally composed with rich detail and appropriate for a portrait card format.
        Include suitable background elements that enhance the ${item.element} theme.
        Art only - NO TEXT, NO CARD FRAMES, NO NUMBERS, NO SYMBOLS overlaid on the image.`;
  
        return await window.ApiService.generateImage(enhancedPrompt);
      } catch (error) {
        console.error(`Error generating ${item.cardCategory} image:`, error);
        return window.getPlaceholderImage(item.name + " " + item.element);
      }
    }
  };