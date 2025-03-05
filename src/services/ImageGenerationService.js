// src/services/ImageGenerationService.js
window.ImageGenerationService = {
  // Simple cache to avoid regenerating similar images
  imageCache: {},
  
  generateCreatureImage: async (creature) => {
    try {
      const cacheKey = `creature_${creature.element}_${creature.class}_${creature.name.substring(0, 20)}`;
      
      // Check cache first
      if (window.ImageGenerationService.imageCache[cacheKey]) {
        console.log("Using cached image for creature:", creature.name);
        return window.ImageGenerationService.imageCache[cacheKey];
      }
      
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

      // Check if user description exists and is not empty - add more logging
      console.log("Raw creature.userDescription:", creature.userDescription);

      // More thorough check for user description
      const userDescription = (creature.userDescription && typeof creature.userDescription === 'string' && creature.userDescription.trim() !== "") ? 
        creature.userDescription : 
        `a powerful ${creature.element.toLowerCase()} ${creature.class.toLowerCase()} creature`;
      
      console.log("Using user description for image generation:", userDescription);
      
      // Extract key effects for visual representation
      const effectKeywords = creature.effectText ?
        creature.effectText.split(' ')
          .filter(word => !['the', 'and', 'with', 'this'].includes(word.toLowerCase()))
          .slice(0, 5)
          .join(' ') : '';

      const enhancedPrompt = `Create a fantasy creature matching this exact description: "${userDescription}".
      This is a ${creature.element} ${creature.class} creature named ${creature.name}.
      ${elementStyle}. ${classStyle}.
      Visual elements should include: ${effectKeywords}.
      Create a detailed digital illustration with the creature as the central focus.
      CRITICAL: The creature's appearance MUST visually match the description "${userDescription}" - maintain all key visual characteristics described.
      Include a suitable background that enhances the ${creature.element} theme.
      IMPORTANT: Create ONLY the creature illustration. NO text, NO borders, NO frames, NO numbers, NO symbols, NO labels of any kind.`;

      console.log("Generating image for prompt:", enhancedPrompt);
      const imageUrl = await window.ApiService.generateImage(enhancedPrompt);
      
      // Store in cache
      window.ImageGenerationService.imageCache[cacheKey] = imageUrl;
      
      return imageUrl;
    } catch (error) {
      console.error('Error generating creature image:', error);
      return window.getPlaceholderImage(creature.name, creature.element);
    }
  },

  generateItemImage: async (item, userDescription = "") => {
    try {
      const cacheKey = `item_${item.cardCategory}_${item.element}_${item.itemType}_${item.name.substring(0, 20)}`;
      
      // Check cache first
      if (window.ImageGenerationService.imageCache[cacheKey]) {
        console.log(`Using cached image for ${item.cardCategory} item:`, item.name);
        return window.ImageGenerationService.imageCache[cacheKey];
      }
      
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

      // Make sure we have a valid description to extract themes from
      const validUserDescription = userDescription && userDescription.trim() !== "" ?
        userDescription : `${item.element} ${item.cardCategory.toLowerCase()}`;

      // Extract thematic keywords that relate to function, not appearance
      const thematicKeywords = item.effectText ? 
        item.effectText.split(' ')
          .filter(word => word.length > 4 && !['creature', 'monster', 'beast', 'dragon'].includes(word.toLowerCase()))
          .slice(0, 3)
          .join(' ') : '';
      
      // Extract only element and environment context from user description
      const elementWords = ["fire", "water", "earth", "air", "light", "shadow", "dark", "ice", "lightning", "forest", "mountain", "ocean", "desert"];
      const contextKeywords = validUserDescription ?
        validUserDescription.split(' ')
          .filter(word => 
            elementWords.includes(word.toLowerCase()) || 
            word.length > 5
          )
          .filter(word => !['dragon', 'beast', 'monster', 'creature', 'turtle', 'humanoid', 'wolf', 'snake'].includes(word.toLowerCase()))
          .slice(0, 2)
          .join(' ') : item.element.toLowerCase();

      const enhancedPrompt = `A high-quality detailed digital illustration of a generic ${item.element} ${itemTypeDescription}${item.cardCategory.toLowerCase()}: ${item.name}. 
      ${elementStyle}. ${categoryStyle}.
      This item has effects related to: ${thematicKeywords}.
      Environmental theme: ${contextKeywords}.
      The item should be centrally composed against a suitable background featuring ${item.element} elements.
      IMPORTANT: Show ONLY the item itself. Do NOT show any creatures, characters or beings using or wearing the item.
      The item should be presented in isolation, without any creatures pictured.
      The design should be generic enough to be used by various types of creatures.
      IMPORTANT: Create ONLY the item illustration. NO text, NO borders, NO frames, NO numbers, NO symbols, NO labels, NO creatures of any kind.`;

      console.log(`Generating item image for prompt:`, enhancedPrompt);
      const imageUrl = await window.ApiService.generateImage(enhancedPrompt);
      
      // Store in cache
      window.ImageGenerationService.imageCache[cacheKey] = imageUrl;
      
      return imageUrl;
    } catch (error) {
      console.error(`Error generating ${item.cardCategory} image:`, error);
      return window.getPlaceholderImage(item.name, item.element);
    }
  }
};