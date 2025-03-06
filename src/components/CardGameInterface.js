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
        <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 animated-bg p-4 font-mono relative overflow-hidden">
            {/* Particle effect background */}
            <div className="absolute inset-0 z-0 opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: '150px 150px'
            }}></div>

            {/* Enhanced CRT scanlines */}
            <div className="absolute inset-0 pointer-events-none z-40 opacity-10">
                <div className="w-full h-full" style={{
                    backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2) 1px, transparent 1px, transparent 2px)`,
                    backgroundSize: '100% 2px'
                }}></div>
            </div>

            {/* Main content container */}
            <div className="max-w-6xl w-full mx-auto relative z-10 h-full overflow-y-auto">
                <div className="bg-gradient-to-br from-gray-800 to-blue-900 border-4 border-yellow-400 rounded-xl p-6 shadow-2xl mb-4">
                    {/* Game State Info */}
                    <GameStateInfo />

                    {/* Card Generation Input - Updated design */}
                    <div className="w-full mb-6 flex flex-col md:flex-row">
                        <div className="relative flex-grow">
                            <div className="bg-blue-900 bg-opacity-80 p-3 rounded-t-lg border-t-2 border-x-2 border-yellow-500 text-xs text-yellow-300 font-bold tracking-wider uppercase">
                                Enter Creature Description
                            </div>
                            <div className="flex">
                                <input
                                    type="text"
                                    className="w-full px-4 py-4 pl-12 bg-gray-900 text-white border-2 border-yellow-500 rounded-bl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
                                    placeholder="Describe a creature (e.g., 'fire dragon', 'water spirit')"
                                    value={userDescription}
                                    onChange={(e) => setUserDescription(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateCardSet()}
                                />
                                <button
                                    className={`px-8 py-4 rounded-br border-2 border-l-0 border-yellow-500 font-bold text-white transition-all ${
                                        isGenerating
                                        ? 'bg-gray-700 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 hover:from-yellow-500 hover:to-amber-400 hover:shadow-lg'
                                    }`}
                                    onClick={handleGenerateCardSet}
                                    disabled={isGenerating}
                                >
                                    <div className="flex items-center">
                                        <div className="mr-2 w-6 h-6 rounded-full bg-yellow-300 bg-opacity-20 flex items-center justify-center">
                                            <span className="text-white text-lg">⚡</span>
                                        </div>
                                        <span className="tracking-wide">{isGenerating ? 'Generating...' : 'Generate'}</span>
                                    </div>
                                </button>
                            </div>
                            <div className="absolute left-4 top-[60px] transform -translate-y-1/2 w-6 h-6 bg-yellow-600 rounded-full border border-yellow-300 flex items-center justify-center">
                                <span className="text-yellow-100 text-sm">✎</span>
                            </div>
                        </div>
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