// src/utils/helpers.js
// Make sure these functions are declared in the global scope
window.getPlaceholderImage = function(prompt) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');

    const hash = prompt.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const hue = hash % 360;

    ctx.fillStyle = `hsl(${hue}, 70%, 30%)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = `hsl(${hue}, 70%, 40%)`;
    ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.fillStyle = 'white';
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Card Image', canvas.width / 2, canvas.height / 2 - 20);

    return canvas.toDataURL('image/png');
}

window.generateFallbackCardInfo = async function(description) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const descLower = description.toLowerCase();
    let cardName;

    const nameAdjectives = ["Ancient", "Mystic", "Chaotic", "Divine", "Infernal", "Celestial",
                              "Corrupted", "Valiant", "Savage", "Arcane", "Radiant", "Shadowy"];
    const nameNouns = ["Guardian", "Destroyer", "Champion", "Sorcerer", "Beast", "Dragon",
                          "Knight", "Spirit", "Lord", "Emperor", "Titan", "Overlord"];

    const words = description.split(' ');
    let keyWord = words.find(word => word.length > 3) || words[0];
    keyWord = keyWord.charAt(0).toUpperCase() + keyWord.slice(1);

    if (Math.random() > 0.5) {
        const adjective = nameAdjectives[Math.floor(Math.random() * nameAdjectives.length)];
        cardName = `${adjective} ${keyWord}`.toUpperCase();
    } else {
        const noun = nameNouns[Math.floor(Math.random() * nameNouns.length)];
        cardName = `${keyWord} ${noun}`.toUpperCase();
    }

    let cardType = 'MONSTER';
    let subType = 'ELEMENTAL';

    if (descLower.includes('spell') || descLower.includes('magic') ||
        descLower.includes('potion') || descLower.includes('scroll') ||
        descLower.includes('enchant') || descLower.includes('cast')) {
        cardType = 'SPELL';
        subType = 'MAGIC';
    } else if (descLower.includes('trap') || descLower.includes('curse') ||
               descLower.includes('ambush') || descLower.includes('snare') ||
               descLower.includes('counter') || descLower.includes('defend')) {
        cardType = 'TRAP';
        subType = 'DARK';
    } else {
        if (descLower.includes('dragon')) {
            subType = 'DRAGON';
        } else if (descLower.includes('warrior') || descLower.includes('knight') ||
                  descLower.includes('fighter') || descLower.includes('soldier') ||
                  descLower.includes('samurai') || descLower.includes('hero')) {
            subType = 'WARRIOR';
        } else if (descLower.includes('beast') || descLower.includes('animal') ||
                  descLower.includes('wolf') || descLower.includes('lion') ||
                  descLower.includes('tiger') || descLower.includes('creature')) {
            subType = 'BEAST';
        } else if (descLower.includes('demon') || descLower.includes('devil') ||
                  descLower.includes('fiend') || descLower.includes('evil') ||
                  descLower.includes('dark') || descLower.includes('corrupt')) {
            subType = 'FIEND';
        } else if (descLower.includes('machine') || descLower.includes('robot') ||
                  descLower.includes('mech') || descLower.includes('android') ||
                  descLower.includes('tech') || descLower.includes('cyber')) {
            subType = 'MACHINE';
        } else if (descLower.includes('angel') || descLower.includes('fairy') ||
                  descLower.includes('spirit') || descLower.includes('celestial') ||
                  descLower.includes('light') || descLower.includes('holy')) {
            subType = 'FAIRY';
        }
    }

    let attack, defense;

    if (cardType === 'MONSTER') {
        const powerWords = {
            weak: ["small", "weak", "minor", "tiny", "fragile"],
            medium: ["average", "normal", "standard", "moderate"],
            strong: ["powerful", "strong", "mighty", "great", "enormous", "giant", "supreme"]
        };

        let powerLevel = 'medium';

        for (const word of words) {
            if (powerWords.weak.includes(word.toLowerCase())) powerLevel = 'weak';
            if (powerWords.strong.includes(word.toLowerCase())) powerLevel = 'strong';
        }

        if (powerLevel === 'weak') {
            attack = Math.floor(Math.random() * 800) + 200;
            defense = Math.floor(Math.random() * 800) + 200;
        } else if (powerLevel === 'strong') {
            attack = Math.floor(Math.random() * 1500) + 1500;
            defense = Math.floor(Math.random() * 1500) + 1000;
        } else {
            attack = Math.floor(Math.random() * 1000) + 800;
            defense = Math.floor(Math.random() * 1000) + 700;
        }
    } else {
        attack = 0;
        defense = 0;
    }

    let effectText;

    const themes = {
        fire: ["fire", "flame", "burn", "heat", "inferno"],
        water: ["water", "ocean", "sea", "flood", "wave"],
        air: ["wind", "air", "storm", "cloud", "sky"],
        earth: ["earth", "stone", "rock", "mountain", "ground"],
        light: ["light", "holy", "sacred", "divine", "heaven"],
        dark: ["dark", "shadow", "night", "corrupt", "evil"]
    };

    let primaryTheme = null;
    for (const [theme, keywords] of Object.entries(themes)) {
        if (keywords.some(keyword => descLower.includes(keyword))) {
            primaryTheme = theme;
            break;
        }
    }

    if (cardType === 'MONSTER') {
        if (primaryTheme) {
            effectText = `When ${cardName} is summoned: gain control of one ${primaryTheme}-type monster your opponent controls. Once per turn: you can inflict 300 damage to your opponent for each ${primaryTheme}-type monster on the field.`;
        } else {
            effectText = `When this card destroys an opponent's monster by battle: draw 1 card. You can tribute this card; Special Summon 2 Level 4 or lower monsters from your hand.`;
        }
    } else if (cardType === 'SPELL') {
        if (primaryTheme) {
            effectText = `Destroy all monsters on the field that aren't ${primaryTheme}-type. Then, Special Summon 1 ${primaryTheme}-type monster from your Graveyard.`;
        } else {
            effectText = `Draw 2 cards, then discard 1 card. If this card is in your Graveyard: you can banish 2 other Spell Cards from your Graveyard; add this card to your hand.`;
        }
    } else {
        if (primaryTheme) {
            effectText = `When your opponent activates a card or effect: Negate the activation, and if you do, inflict 1000 damage to your opponent. Cards with "${primaryTheme}" in their name cannot be destroyed this turn.`;
        } else {
            effectText = `When your opponent's monster declares an attack: Target the attacking monster; negate the attack, and if you do, destroy that target. You can only activate 1 "${cardName}" per turn.`;
        }
    }

    let flavorText;
    const flavorTemplates = [
        `"Only those who master the power of ${keyWord} can truly understand its secrets."`,
        `"Legends speak of ${keyWord}'s might echoing through the ages."`,
        `"When ${keyWord} appears, even the gods themselves take notice."`,
        `"The ancient scrolls foretold the coming of ${keyWord}, but none were prepared."`,
        `"${keyWord}'s presence changes the very nature of battle itself."`
    ];
    flavorText = flavorTemplates[Math.floor(Math.random() * flavorTemplates.length)];

    const rarityOptions = ["Common", "Rare", "Super Rare", "Ultra Rare", "Secret Rare"];
    const rarityLevel = effectText.length > 100 ?
        Math.min(4, Math.floor(Math.random() * 3) + 2) :
        Math.floor(Math.random() * 3);

    return {
        name: cardName,
        rarity: Math.floor(Math.random() * 3) + (rarityLevel > 2 ? 3 : 1),
        type: cardType,
        subtype: subType,
        cardId: `MTD-BR${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
        effectText: effectText,
        flavorText: flavorText,
        attack: attack,
        defense: defense,
        rarityText: rarityOptions[rarityLevel],
        setId: `JRPG-${Math.floor(Math.random() * 99).toString().padStart(2, '0')}`
    };
}