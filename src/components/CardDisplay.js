// src/components/CardDisplay.js
// CardDisplay.js

const CardDisplay = ({ generatedCard, isGenerating, cardFacing, toggleCardFace, showHolographic, toggleHolographic, cardInfo }) => {
    return (
        <div
            className="relative flex-grow h-96 bg-gradient-to-br from-blue-900 to-purple-900 border-2 border-yellow-300 rounded-lg overflow-hidden shadow-lg flex items-center justify-center"
        >
            {generatedCard ? (
                <div className={`relative w-64 h-full flex items-center justify-center transition-transform duration-500`} style={{
                    transform: cardFacing === 'back' ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}>
                    {/* Front of card */}
                    <div className={`absolute inset-0 backface-hidden ${cardFacing === 'back' ? 'opacity-0' : 'opacity-100'} flex items-center justify-center transition-opacity duration-500`}>
                        <div className="relative w-64 h-80 rounded-lg overflow-hidden border-4 border-yellow-300 shadow-lg" style={{
                            boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)'
                        }}>
                            {/* Card background image */}
                            <img
                                src={generatedCard}
                                alt="Generated Card"
                                className="w-full h-full object-cover"
                                style={{
                                    background: 'linear-gradient(to bottom, #1a202c, #2d3748)'
                                }}
                            />

                            {/* Holographic effect overlay */}
                            {showHolographic && (
                                <div className="holographic-effect" style={{
                                    backgroundSize: '200% 200%'
                                }}></div>
                            )}

                            {/* Card content layout */}
                            <div className="absolute inset-0 flex flex-col">
                                {/* Card name bar - at top but not overlapping art too much */}
                                <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-md m-2 opacity-90 flex items-center justify-center px-2 py-1">
                                    <span className="text-sm font-bold text-black leading-tight text-center" style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: '2',
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {cardInfo.name}
                                    </span>
                                </div>

                                {/* Spacer to push other elements to bottom */}
                                <div className="flex-grow"></div>

                                {/* Bottom card elements */}
                                <div className="p-2">
                                    {/* Card rarity stars */}
                                    <div className="absolute top-12 left-2 flex">
                                        {Array.from({ length: cardInfo.rarity }).map((_, index) => (
                                            <div key={index} className="text-yellow-300 text-xs">★</div>
                                        ))}
                                    </div>

                                    {/* Card type icons */}
                                    <div className="flex space-x-1 justify-end mb-2">
                                        <div className="w-6 h-6 rounded-full bg-purple-600 border border-white flex items-center justify-center text-white text-xs">
                                            {cardInfo.type?.charAt(0) || 'M'}
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-green-600 border border-white flex items-center justify-center text-white text-xs">
                                            {cardInfo.subtype?.charAt(0) || 'S'}
                                        </div>
                                    </div>

                                    {/* Card stats box */}
                                    <div className="w-20 h-8 bg-black bg-opacity-80 rounded border border-yellow-400 flex items-center justify-center ml-auto">
                                        <span className="text-white text-xs">
                                            {cardInfo.attack}/{cardInfo.defense}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back of card */}
                    <div className={`absolute inset-0 backface-hidden ${cardFacing === 'front' ? 'opacity-0' : 'opacity-100'} flex items-center justify-center transition-opacity duration-500`} style={{
                        transform: 'rotateY(180deg)'
                    }}>
                        <div className="w-64 h-80 rounded-lg overflow-hidden border-4 border-yellow-300 bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full border-8 border-yellow-500 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                                <div className="text-3xl font-bold text-red-900">★</div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-white text-center p-4">
                    {isGenerating ? (
                        <div className="animate-pulse">
                            <div className="text-yellow-300 mb-2">Generating Card Image...</div>
                            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </div>
                    ) : (
                        <div>
                            <p className="text-lg mb-2">No Card Generated Yet</p>
                            <p className="text-sm text-gray-300">Enter a description and click Generate</p>
                        </div>
                    )}
                </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-3 text-white text-xs z-10">
                <button
                    className="bg-transparent flex items-center gap-1"
                    onClick={toggleCardFace}
                >
                    <span className="bg-black bg-opacity-70 rounded-full w-6 h-6 flex items-center justify-center border border-green-400">A</span>
                    <span className="text-green-300">Flip</span>
                </button>
                <button
                    className="bg-transparent flex items-center gap-1"
                    onClick={toggleHolographic}
                >
                    <span className="bg-black bg-opacity-70 rounded-full w-6 h-6 flex items-center justify-center border border-purple-400">X</span>
                    <span className="text-purple-300">Holo</span>
                </button>
            </div>
        </div>
    );
};

window.CardDisplay = CardDisplay;