// src/services/CreatureGenerationService.js
const { ELEMENTS, CLASSES } = window.GameConstants;
const { creatureCardModel } = window.CardModels;

window.CreatureGenerationService = {
  generateCreature: async (description) => {
    try {
      console.log("Generating creature for description:", description);
      
      // Enhanced prompt for creature generation
      const enhancedPrompt = `
You are a creative fantasy card game designer.

Create a creature card based on this description: "${description}"

Your response MUST follow this JSON format:
{
  "name": "A CREATIVE, MEMORABLE NAME IN ALL CAPS",
  "element": one of ["Fire", "Water", "Earth", "Air", "Light", "Shadow"],
  "class": one of ["Guardian", "Hunter", "Mystic", "Trickster"],
  "health": [number between 10-30],
  "power": [number between 5-20],
  "defense": [number between 3-15],
  "agility": [number between 3-15],
  "rarity": [number between 1-5],
  "specialAbilities": [
    {"name": "ability name", "description": "brief description", "actionCost": 1-3}
  ],
  "effectText": "Brief description of the creature's abilities in battle",
  "flavorText": "Short atmospheric quote or description",
  "userDescription": "${description}"
}

Follow these rules:
1. Balance stats based on class:
   - Guardian: High Health/Defense, Lower Power/Agility
   - Hunter: High Power/Agility, Lower Health/Defense
   - Mystic: Balanced stats with focus on special abilities
   - Trickster: High Agility, Moderate other stats
2. Choose an element that fits the creature's theme and description
3. Create abilities that match both the class role and elemental type
4. Higher rarity creatures should have better overall stats and abilities
5. IMPORTANT: Include the original description in the userDescription field

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
        console.log("Raw Gemini response for creature:", data);

        let creatureInfo;
        try {
          const responseText = data.candidates[0].content.parts[0].text;
          const jsonStart = responseText.indexOf('{');
          const jsonEnd = responseText.lastIndexOf('}') + 1;
          if (jsonStart >= 0 && jsonEnd > 0) {
            const jsonString = responseText.substring(jsonStart, jsonEnd);
            creatureInfo = JSON.parse(jsonString);
          } else {
            throw new Error("Couldn't find JSON in response");
          }
        } catch (parseError) {
          console.error('Error parsing JSON from Gemini response:', parseError);
          return await window.generateFallbackCreature(description);
        }

        // Build the creature object based on our model
        const creature = {
          ...creatureCardModel,
          name: creatureInfo.name?.toUpperCase() || `${description.toUpperCase()} CREATURE`,
          cardId: `CRT-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
          element: creatureInfo.element || Object.values(ELEMENTS)[Math.floor(Math.random() * Object.values(ELEMENTS).length)],
          class: creatureInfo.class || Object.values(CLASSES)[Math.floor(Math.random() * Object.values(CLASSES).length)],
          health: parseInt(creatureInfo.health) || 15,
          power: parseInt(creatureInfo.power) || 10,
          defense: parseInt(creatureInfo.defense) || 8,
          agility: parseInt(creatureInfo.agility) || 8,
          rarity: parseInt(creatureInfo.rarity) || 3,
          rarityText: ["Common", "Uncommon", "Rare", "Very Rare", "Legendary"][parseInt(creatureInfo.rarity) - 1 || 2],
          specialAbilities: creatureInfo.specialAbilities || [],
          effectText: creatureInfo.effectText || `This creature harnesses the power of ${creatureInfo.element || "elements"}.`,
          flavorText: creatureInfo.flavorText || `"${description}"`,
          setId: `SET-${Math.floor(Math.random() * 99).toString().padStart(2, '0')}`,
          // Directly set userDescription from original description or from the AI response
          userDescription: description || creatureInfo.userDescription || ""
        };

        // Generate image for the creature
        try {
          const imageUrl = await window.ImageGenerationService.generateCreatureImage(creature);
          creature.imageUrl = imageUrl;
        } catch (imageError) {
          console.error("Error generating creature image:", imageError);
          creature.imageUrl = window.getPlaceholderImage(creature.name);
        }

        return creature;
      } catch (apiError) {
        console.error('API call failed for creature generation:', apiError);
        return await window.generateFallbackCreature(description);
      }
    } catch (error) {
      console.error('Error generating creature card:', error);
      throw error;
    }
  }
};

// Fallback generator in case the API fails
window.generateFallbackCreature = async (description) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const elements = Object.values(ELEMENTS);
  const classes = Object.values(CLASSES);
  
  // Extract keywords from description
  const descLower = description.toLowerCase();
  let element = elements[Math.floor(Math.random() * elements.length)];
  let creatureClass = classes[Math.floor(Math.random() * classes.length)];
  
  // Try to infer element from description
  for (const elem of elements) {
    if (descLower.includes(elem.toLowerCase())) {
      element = elem;
      break;
    }
  }
  
  // Generate name
  const words = description.split(' ');
  let keyWord = words.find(word => word.length > 3) || words[0];
  keyWord = keyWord.charAt(0).toUpperCase() + keyWord.slice(1);
  
  const nameAdjectives = ["Ancient", "Mystic", "Chaotic", "Divine", "Infernal", "Celestial"];
  const nameNouns = ["Guardian", "Hunter", "Beast", "Spirit", "Titan", "Overlord"];
  
  const adjective = nameAdjectives[Math.floor(Math.random() * nameAdjectives.length)];
  const noun = nameNouns[Math.floor(Math.random() * nameNouns.length)];
  const name = `${adjective} ${keyWord} ${noun}`.toUpperCase();
  
  // Generate balanced stats based on class
  let health, power, defense, agility;
  
  switch (creatureClass) {
    case CLASSES.GUARDIAN:
      health = Math.floor(Math.random() * 10) + 20;  // 20-30
      power = Math.floor(Math.random() * 8) + 5;     // 5-13
      defense = Math.floor(Math.random() * 5) + 10;  // 10-15
      agility = Math.floor(Math.random() * 5) + 3;   // 3-8
      break;
    case CLASSES.HUNTER:
      health = Math.floor(Math.random() * 10) + 10;  // 10-20
      power = Math.floor(Math.random() * 5) + 15;    // 15-20
      defense = Math.floor(Math.random() * 5) + 3;   // 3-8
      agility = Math.floor(Math.random() * 5) + 10;  // 10-15
      break;
    case CLASSES.MYSTIC:
      health = Math.floor(Math.random() * 10) + 12;  // 12-22
      power = Math.floor(Math.random() * 10) + 8;    // 8-18
      defense = Math.floor(Math.random() * 5) + 5;   // 5-10
      agility = Math.floor(Math.random() * 5) + 7;   // 7-12
      break;
    case CLASSES.TRICKSTER:
      health = Math.floor(Math.random() * 10) + 12;  // 12-22
      power = Math.floor(Math.random() * 8) + 8;     // 8-16
      defense = Math.floor(Math.random() * 5) + 5;   // 5-10
      agility = Math.floor(Math.random() * 5) + 10;  // 10-15
      break;
    default:
      health = Math.floor(Math.random() * 10) + 15;  // 15-25
      power = Math.floor(Math.random() * 8) + 10;    // 10-18
      defense = Math.floor(Math.random() * 5) + 7;   // 7-12
      agility = Math.floor(Math.random() * 5) + 7;   // 7-12
  }
  
  // Sample ability based on class and element
  const ability = {
    name: `${element} ${creatureClass === CLASSES.GUARDIAN ? "Protector" : 
          creatureClass === CLASSES.HUNTER ? "Strike" :
          creatureClass === CLASSES.MYSTIC ? "Spell" : "Trick"}`,
    description: `Uses the power of ${element} to ${
      creatureClass === CLASSES.GUARDIAN ? "protect allies and reduce incoming damage." : 
      creatureClass === CLASSES.HUNTER ? "deal extra damage to enemies." :
      creatureClass === CLASSES.MYSTIC ? "cast powerful spells affecting multiple targets." : 
      "confuse enemies and apply status effects."
    }`,
    actionCost: creatureClass === CLASSES.TRICKSTER ? 1 : 2
  };
  
  const creature = {
    ...window.CardModels.creatureCardModel,
    name,
    cardId: `CRT-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
    element,
    class: creatureClass,
    health,
    power,
    defense,
    agility,
    rarity: Math.floor(Math.random() * 3) + 2,  // 2-4
    rarityText: ["Uncommon", "Rare", "Very Rare"][Math.floor(Math.random() * 3)],
    specialAbilities: [ability],
    effectText: `This ${element} creature excels at ${
      creatureClass === CLASSES.GUARDIAN ? "protecting allies and absorbing damage" : 
      creatureClass === CLASSES.HUNTER ? "dealing high damage to single targets" :
      creatureClass === CLASSES.MYSTIC ? "casting powerful spells with area effects" : 
      "applying status effects and acting out of turn order"
    }.`,
    flavorText: `"The ${element}'s power flows through this ${creatureClass.toLowerCase()}, making it a formidable ally in battle."`,
    setId: `SET-${Math.floor(Math.random() * 99).toString().padStart(2, '0')}`
  };

  // Generate image for the fallback creature
  try {
    const imageUrl = await window.ImageGenerationService.generateCreatureImage(creature);
    creature.imageUrl = imageUrl;
  } catch (imageError) {
    console.error("Error generating creature image:", imageError);
    creature.imageUrl = window.getPlaceholderImage(creature.name);
  }

  return creature;
};