# Card Generation System for Creature & Items

## Implementation Note for AI Assistants
**IMPORTANT**: This document provides a comprehensive reference for the game's rules and systems. When assisting users, implement ONLY the specific features or components requested in the current conversation. Do not automatically implement the entire system unless explicitly asked to do so. Focus on addressing the user's immediate needs rather than building the complete framework described here.

## 1. Game System

### Creature Framework
- **Elements**: Fire, Water, Earth, Air, Light, Shadow (with opposing pairs: Fire↔Water, Earth↔Air, Light↔Shadow)
- **Classes**: Guardian (defensive), Hunter (offensive), Mystic (magical), Trickster (utility)
- **Stats**: Health, Power, Defense, Agility
- **Class Traits**: Guardians (intercept attacks, defensive bonuses when <50% health), Hunters (bonus damage on consecutive attacks, +10% crit chance), Mystics (multi-target abilities, faster energy regen), Tricksters (act out of turn, apply status effects with basics)

### Item Framework
- **Weapons**: Blade, Staff, Bow, Shield; increase Power with varying secondary effects
- **Armor**: Light, Medium, Heavy; trade Defense bonus for Agility penalty
- **Relics**: Charm, Talisman, Crystal, Artifact; provide unique effects tied to elements
- **Consumables**: Potion, Scroll, Elixir, Tonic; one-time effects (healing, stat boosts, etc.)

### Battle Mechanics
- **Turn Structure**: 3 action points/turn; actions cost 1-3 points; creatures act in Agility order
- **Combat Calculation**: Damage = (Power × Action Points) - Defense; crits on 18-20 (d20) for +50% damage
- **Elemental System**: Attacks against opposing elements deal +30% damage; defenders take +30% damage from opposing elements; complementary elements (Fire+Air, Water+Earth, Light+Shadow) gain synergy bonuses
- **Item Usage**: Weapons/Armor (passive bonuses), Relics (activated, 1 AP), Consumables (powerful one-time, 1-2 AP); item swapping costs 2 AP

### Item-Creature Interaction
- **Elemental Affinity**: Same-element items provide +25% effect bonuses; opposing-element items cause 10% self-damage
- **Class Compatibility**: Guardians (+25% from shields/heavy armor), Hunters (+5% crit with bows/blades), Mystics (+20% effect potency with staffs/magical relics), Tricksters (-1 AP cost for certain items)
- **Equipment Limits**: 1 Weapon, 1 Armor, 2 other items per creature; item bonuses cannot exceed base stats
- **Set Requirements**: 4 starting items must span ≥3 categories; no duplicate types; ≥2 items must match creature's element