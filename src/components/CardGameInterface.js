// src/components/CardGameInterface.js
// Access ApiService and helper functions through the global scope (window)

const CardGameInterface = () => {
    const [userDescription, setUserDescription] = React.useState('');
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [generatedCard, setGeneratedCard] = React.useState(null);
    const [cardInfo, setCardInfo] = React.useState({
        name: '',
        rarity: 0,
        type: '',
        subtype: '',
        cardId: '',
        effectText: '',
        flavorText: '',
        attack: 0,
        defense: 0,
        rarityText: '',
        setId: ''
    });

    const [highlightedOption, setHighlightedOption] = React.useState(null);
    const [showCardInfo, setShowCardInfo] = React.useState(true);
    const [cardFacing, setCardFacing] = React.useState('front');
    const [showHolographic, setShowHolographic] = React.useState(true);
    const [infoTab, setInfoTab] = React.useState('details');
    const [cardsInHand, setCardsInHand] = React.useState(5);

    const cardTemplate = {
        name: "CARD NAME IN ALL CAPS",
        rarity: "Number from 1-5",
        type: "MONSTER, SPELL, or TRAP",
        subtype: "ELEMENTAL, DARK, MACHINE, etc.",
        cardId: "Unique ID in format MTD-BRXXX",
        effectText: "Card effect description",
        flavorText: "Flavor text in quotes",
        attack: "Number from 0-3000",
        defense: 0,
        rarityText: "Common, Rare, Ultra Rare, etc.",
        setId: "Set ID in format JRPG-XX"
    };

    const handleGenerateCard = async () => {
        if (!userDescription.trim() || isGenerating) return;

        try {
            setIsGenerating(true);
            const imageUrl = await window.ApiService.generateImage(userDescription);
            setGeneratedCard(imageUrl);

            const info = await window.ApiService.generateCardInfo(userDescription, cardTemplate);
            setCardInfo(info);

        } catch (error) {
            console.error('Error in card generation process:', error);
            alert('Error generating card. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const toggleCardFace = () => {
        setCardFacing(prev => prev === 'front' ? 'back' : 'front');
    };

    const toggleHolographic = () => {
        setShowHolographic(prev => !prev);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-900 p-4 font-mono overflow-hidden relative">
            {/* Card Game Background */}
            <div className="absolute inset-0 z-0 opacity-20" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                backgroundColor: '#151530'
            }}></div>

            {/* CRT Scanlines overlay */}
            <div className="absolute inset-0 pointer-events-none z-40 opacity-20">
                <div className="w-full h-full" style={{
                    backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)`,
                    backgroundSize: '100% 2px'
                }}></div>
            </div>

            {/* Card Game UI */}
            <div className="max-w-4xl w-full pixelated relative z-10">
                <div className="bg-gradient-to-b from-blue-800 to-purple-900 border-4 border-yellow-400 rounded-lg p-4 shadow-lg">

                    {/* Game State Info */}
                    <GameStateInfo />

                    {/* Card Generation Input */}
                    <GenerationInput
                        userDescription={userDescription}
                        setUserDescription={setUserDescription}
                        handleGenerateCard={handleGenerateCard}
                        isGenerating={isGenerating}
                    />

                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Card Display (2D) */}
                        <CardDisplay
                            generatedCard={generatedCard}
                            isGenerating={isGenerating}
                            cardFacing={cardFacing}
                            toggleCardFace={toggleCardFace}
                            showHolographic={showHolographic}
                            toggleHolographic={toggleHolographic}
                            cardInfo={cardInfo}
                        />

                        {/* Card Info Panel */}
                        <CardInfoPanel
                            cardInfo={cardInfo}
                            highlightedOption={highlightedOption}
                            setHighlightedOption={setHighlightedOption}
                            infoTab={infoTab}
                            setInfoTab={setInfoTab}
                        />
                    </div>

                    {/* Display cards in hand */}
                    <HandDisplay
                        generatedCard={generatedCard}
                        cardsInHand={cardsInHand}
                    />

                    {/* Game Phase Indicator */}
                    <div className="mt-2 flex justify-between items-center">
                        <div className="text-xs text-white">
                            <span className="text-yellow-300">Fase: </span>
                            <span className="bg-red-900 px-2 py-1 rounded">GERAÇÃO</span>
                        </div>
                        <div className="text-xs text-white animate-pulse">
                            {isGenerating ? 'Gerando carta...' : 'Esperando descrição...'}
                        </div>
                        <div className="text-xs text-white">
                            <span className="text-yellow-300">Turno: </span>
                            <span>1</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

window.CardGameInterface = CardGameInterface;