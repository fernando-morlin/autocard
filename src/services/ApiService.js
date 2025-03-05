// src/services/ApiService.js
window.ApiService = {
    generateImage: async (prompt) => {
        try {
            console.log("Generating image for prompt:", prompt);
            
            const artStyles = [
                "fantasy illustration with dramatic lighting",
                "high detail digital art",
                "high quality artwork",
                "ultra detailed",
                "vibrant colors"
            ];
            
            const randomArtStyle = artStyles[Math.floor(Math.random() * artStyles.length)];
            const enhancedPrompt = `${prompt}, ${randomArtStyle}`;
            
            console.log("Calling Imagen API...");
            
            // Using the same format as Gemini for consistency
            const response = await fetch('http://localhost:3000/api/imagen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'imagen-3.0-generate-002',
                    instances: [
                        { prompt: enhancedPrompt }
                    ],
                    parameters: {
                        aspectRatio: "1:1"  // Change from "square" to "1:1" format
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Imagen API call failed: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log("Imagen API response received");
            
            // Extract image data from the response structure
            if (data.predictions && data.predictions.length > 0) {
                const imageData = data.predictions[0].bytesBase64Encoded;
                if (imageData) {
                    return `data:image/png;base64,${imageData}`;
                }
            }
            
            console.error("Could not find image data in response:", 
                JSON.stringify(data, null, 2).substring(0, 500) + "...");
                
            throw new Error("No image data found in API response");

        } catch (error) {
            console.error('Error generating image:', error);
            return window.getPlaceholderImage(prompt);
        }
    },

    // generateImageWithImagen has been removed as it duplicated functionality in generateImage
    
    generateCardInfo: async (description, template) => {
        try {
            console.log("Generating card info for:", description);
            const enhancedPrompt = `
You are a creative fantasy trading card game designer.

Create a unique, imaginative card based on this description: "${description}"
/* ...rest of your prompt... */`;

            try {
                const response = await fetch('http://localhost:3000/api/gemini', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: 'gemini-2.0-pro-exp-02-05',
                        body: {
                            contents: [{
                                parts: [{ text: enhancedPrompt }]
                            }]
                        }
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