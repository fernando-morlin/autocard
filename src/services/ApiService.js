// src/services/ApiService.js
// Make sure ApiService is declared in the global scope
window.ApiService = {
    generateImage: async (prompt) => {
        try {
            console.log("Generating image for prompt:", prompt);

            const artStyles = [
                "fantasy illustration with dramatic lighting",
                "detailed digital painting with vibrant colors",
                "stylized concept art with bold shapes",
                "realistic rendered 3D art with atmospheric effects",
                "painted artwork with rich textures",
                "dark fantasy art with high contrast",
                "colorful stylized illustration"
            ];

            const chosenStyle = artStyles[Math.floor(Math.random() * artStyles.length)];
            const enhancedPrompt = `A high-quality trading card game artwork in the style of ${chosenStyle}, depicting: ${prompt}.
            The image should be centrally composed with rich detail and appropriate for a portrait card format.
            Include suitable background elements that enhance the theme.
            Art only - NO TEXT, NO CARD FRAMES, NO NUMBERS, NO SYMBOLS overlaid on the image.`;

            console.log("Calling Stable Horde API...");

            try {
                const response = await fetch('https://stablehorde.net/api/v2/generate/async', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': window.CONFIG.STABLE_HORDE_API_KEY
                    },
                    body: JSON.stringify({
                        prompt: enhancedPrompt,
                        params: {
                            width: 512,
                            height: 768,
                            steps: 30,
                            sampler_name: "k_euler_a",
                            cfg_scale: 7.5,
                            karras: true,
                            hires_fix: true,
                            post_processing: ["GFPGAN"]
                        },
                        r2: false,
                        nsfw: false,
                        trusted_workers: true
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Stable Horde API error:', errorText);
                    throw new Error(`API responded with status: ${response.status}`);
                }

                const requestData = await response.json();
                console.log("Stable Horde request accepted:", requestData);

                if (!requestData.id) {
                    throw new Error('No request ID returned from Stable Horde');
                }

                const requestId = requestData.id;
                let imageUrl = null;
                let attempts = 0;
                const maxAttempts = 30;

                while (!imageUrl && attempts < maxAttempts) {
                    attempts++;
                    console.log(`Checking generation status (attempt ${attempts})...`);
                    await new Promise(resolve => setTimeout(resolve, 3000));

                    const statusResponse = await fetch(`https://stablehorde.net/api/v2/generate/check/${requestId}`);
                    if (!statusResponse.ok) {
                        console.error('Status check failed:', await statusResponse.text());
                        continue;
                    }

                    const statusData = await statusResponse.json();
                    console.log("Generation status:", statusData);

                    if (statusData.done) {
                        const resultResponse = await fetch(`https://stablehorde.net/api/v2/generate/status/${requestId}`);
                        if (resultResponse.ok) {
                            const resultData = await resultResponse.json();
                            console.log("Generation complete:", resultData);

                            if (resultData.generations && resultData.generations.length > 0) {
                                if (resultData.generations[0].img) {
                                    imageUrl = `data:image/webp;base64,${resultData.generations[0].img}`;
                                } else if (resultData.generations[0].img_urls && resultData.generations[0].img_urls.length > 0) {
                                    imageUrl = resultData.generations[0].img_urls[0];
                                }
                            }
                        }
                        break;
                    }
                }

                if (imageUrl) {
                    return imageUrl;
                } else {
                    console.error("Failed to get image after multiple attempts");
                    return window.getPlaceholderImage(prompt);
                }

            } catch (apiError) {
                console.error('Stable Horde API call failed:', apiError);
                return window.getPlaceholderImage(prompt);
            }
        } catch (error) {
            console.error('Error generating image:', error);
            return window.getPlaceholderImage(prompt);
        }
    },

    generateCardInfo: async (description, template) => {
        try {
            console.log("Generating card info for:", description);

            const enhancedPrompt = `
You are a creative fantasy trading card game designer.

Create a unique, imaginative card based on this description: "${description}"

You have complete creative freedom, but your response MUST follow this JSON format:
{
  "name": "A CREATIVE, MEMORABLE NAME IN ALL CAPS - NOT just the first words of the description",
  "rarity": [number between 1-5],
  "type": "MONSTER" or "SPELL" or "TRAP",
  "subtype": "ELEMENTAL" or "DARK" or "MACHINE" or "WARRIOR" or "DRAGON" or "BEAST" or "FIEND" or "FAIRY",
  "cardId": "MTD-BR[3 random digits]",
  "effectText": "[Write a creative game effect based on the card's theme and type. 2-3 sentences.]",
  "flavorText": "[Write an atmospheric quote or short description that enhances the card's theme. 1 sentence.]",
  "attack": [number between 0-3000, use 0 for non-monster cards],
  "defense": [number between 0-3000, use 0 for non-monster cards],
  "rarityText": "Common" or "Rare" or "Super Rare" or "Ultra Rare" or "Secret Rare",
  "setId": "JRPG-[2 random digits]"
}

Important rules:
1. The card name MUST be original and creative - DO NOT simply use the first few words of the description
2. Create a name that captures the essence of the card while being catchy and memorable
3. Example good names: "ANCIENT CRYSTAL DRAGON", "VOID DEMON SORCERER", "SHIMMERING DESTINY BLADE"
4. Make the effect text mechanically interesting and thematically appropriate
5. Create flavor text that enhances the fantasy atmosphere
6. For monsters, assign reasonable attack/defense values based on the theme
7. For spell/trap cards, set attack and defense to 0
8. Choose the most appropriate type and subtype based on the description
9. IMPORTANT: Carefully analyze the description to determine if it should be a SPELL or TRAP card instead of a MONSTER
10. If the description mentions magic, spells, enchantments, or effects, consider making it a SPELL card
11. If the description suggests traps, ambushes, defensive measures, or countermeasures, consider making it a TRAP card
12. Only make it a MONSTER card if the description clearly describes a creature or character

Return ONLY the JSON object with no additional explanation.`;

            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro-exp-02-05:generateContent?key=${window.CONFIG.GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
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
                console.log("Raw Gemini response:", data);

                let cardInfo;
                try {
                    const responseText = data.candidates[0].content.parts[0].text;
                    const jsonStart = responseText.indexOf('{');
                    const jsonEnd = responseText.lastIndexOf('}') + 1;
                    if (jsonStart >= 0 && jsonEnd > 0) {
                        const jsonString = responseText.substring(jsonStart, jsonEnd);
                        cardInfo = JSON.parse(jsonString);
                    } else {
                        throw new Error("Couldn't find JSON in response");
                    }
                } catch (parseError) {
                    console.error('Error parsing JSON from Gemini response:', parseError);
                    return await window.generateFallbackCardInfo(description);
                }

                return {
                    name: cardInfo.name?.toUpperCase() || description.toUpperCase(),
                    rarity: parseInt(cardInfo.rarity) || Math.floor(Math.random() * 5) + 1,
                    type: cardInfo.type?.toUpperCase() || "MONSTER",
                    subtype: cardInfo.subtype?.toUpperCase() || "ELEMENTAL",
                    cardId: cardInfo.cardId || `MTD-BR${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
                    effectText: cardInfo.effectText || `This card gains power from ${description}.`,
                    flavorText: cardInfo.flavorText || `"${description}"`,
                    attack: parseInt(cardInfo.attack) || Math.floor(Math.random() * 3000),
                    defense: parseInt(cardInfo.defense) || Math.floor(Math.random() * 3000),
                    rarityText: cardInfo.rarityText || "Rare",
                    setId: cardInfo.setId || `JRPG-${Math.floor(Math.random() * 99).toString().padStart(2, '0')}`
                };
            } catch (apiError) {
                console.error('API call failed:', apiError);
                return await window.generateFallbackCardInfo(description);
            }
        } catch (error) {
            console.error('Error generating card info:', error);
            throw error;
        }
    }
};