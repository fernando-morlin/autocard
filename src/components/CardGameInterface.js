// src/components/CardGameInterface.js - Updated version with better scrolling
const CardGameInterface = () => {
    const [userDescription, setUserDescription] = React.useState('');
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [cardSet, setCardSet] = React.useState(null);
    const [highlightedOption, setHighlightedOption] = React.useState(null);
    const [infoTab, setInfoTab] = React.useState('details');

    const handleGenerateCardSet = async () => {
        if (!userDescription.trim() || isGenerating) return;

        try {
            setIsGenerating(true);
            
            const generatedSet = await window.CardSetGenerationService.generateCardSet(userDescription);
            setCardSet(generatedSet);

        } catch (error) {
            console.error('Error in card set generation process:', error);
            alert('Error generating card set. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full h-screen bg-blue-900 p-4 font-mono relative overflow-hidden">
            {/* Background effects */}
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

            {/* Scrollable Card Game UI Container */}
            <div className="max-w-6xl w-full mx-auto pixelated relative z-10 h-full overflow-y-auto">
                <div className="bg-gradient-to-b from-blue-800 to-purple-900 border-4 border-yellow-400 rounded-lg p-4 shadow-lg mb-4">
                    {/* Game State Info */}
                    <GameStateInfo />

                    {/* Card Generation Input */}
                    <div className="w-full mb-4 flex">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                className="w-full px-3 py-3 pl-10 bg-gray-900 text-white border-2 border-yellow-400 rounded-l focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="Describe a creature (e.g., 'fire dragon', 'water spirit')"
                                value={userDescription}
                                onChange={(e) => setUserDescription(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerateCardSet()}
                            />
                            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-800 rounded border border-yellow-500 flex items-center justify-center pointer-events-none">
                                <span className="text-yellow-500 font-bold text-xs">✎</span>
                            </div>
                        </div>

                        <button
                            className={`px-6 py-3 rounded-r font-bold text-white border-2 border-l-0 border-yellow-400 flex items-center ${
                                isGenerating
                                ? 'bg-gray-700 cursor-not-allowed'
                                : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500'
                            }`}
                            onClick={handleGenerateCardSet}
                            disabled={isGenerating}
                        >
                            <div className="mr-2 w-5 h-5 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
                                <span className="text-yellow-300">⚡</span>
                            </div>
                            {isGenerating ? 'Generating...' : 'Generate Creature & Items'}
                        </button>
                    </div>

                    {/* Card Set Display */}
                    <CardSetDisplay cardSet={cardSet} isGenerating={isGenerating} />

                    {/* Game Phase Indicator */}
                    <div className="mt-2 flex justify-between items-center">
                        <div className="text-xs text-white">
                            <span className="text-yellow-300">Phase: </span>
                            <span className="bg-red-900 px-2 py-1 rounded">GENERATION</span>
                        </div>
                        <div className="text-xs text-white animate-pulse">
                            {isGenerating ? 'Generating card set...' : cardSet ? 'Card set ready!' : 'Waiting for description...'}
                        </div>
                        <div className="text-xs text-white">
                            <span className="text-yellow-300">Set: </span>
                            <span>{cardSet?.creature?.setId || 'None'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

window.CardGameInterface = CardGameInterface;