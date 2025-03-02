// src/components/CardDisplay.js
const CardDisplay = ({ generatedCard, isGenerating, cardFacing, toggleCardFace, showHolographic, toggleHolographic, cardInfo }) => {
    return (
        <div
            className="relative flex-grow h-auto bg-gradient-to-br from-blue-900 to-purple-900 border-2 border-yellow-300 rounded-lg overflow-hidden shadow-lg flex flex-col items-center justify-center py-6"
            style={{ minHeight: "440px" }}
        >
            {generatedCard ? (
                <div className="flex flex-col items-center justify-between h-full">
                    {/* Card container with improved spacing */}
                    <div className={`relative max-w-xs flex items-center justify-center transition-transform duration-500`} 
                        style={{
                            transform: cardFacing === 'back' ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            width: "240px",  // Fixed width for consistency
                            height: "336px",  // Based on standard TCG card ratio (2.5"×3.5")
                            marginTop: "8px"
                        }}>
                        {/* Front of card */}
                        <div className={`absolute inset-0 backface-hidden ${cardFacing === 'back' ? 'opacity-0' : 'opacity-100'} flex items-center justify-center transition-opacity duration-500`}>
                            <div className="relative w-full h-full rounded-lg overflow-hidden border-4 border-yellow-300 shadow-lg" style={{
                                boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)'
                            }}>
                                {/* Card background image */}
                                <div className="relative w-full h-full">
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
                                        <div className="holographic-effect absolute inset-0" style={{
                                            backgroundSize: '200% 200%'
                                        }}></div>
                                    )}
                                </div>

                                {/* Card content layout */}
                                <div className="absolute inset-0 flex flex-col">
                                    {/* Upper elements container */}
                                    <div className="relative flex justify-between px-2 pt-2">
                                        {/* Card rarity stars (LEFT UPPER CORNER) - Improved styling */}
                                        <div className="flex bg-gradient-to-r from-black to-gray-800 bg-opacity-80 rounded-md py-1 px-2 border border-yellow-400 shadow-inner">
                                            {Array.from({ length: cardInfo.rarity }).map((_, index) => (
                                                <div key={index} className="text-yellow-300 text-sm mx-px card-star">★</div>
                                            ))}
                                        </div>
                                        
                                        {/* Card stats box (RIGHT UPPER CORNER) - Improved styling */}
                                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-md border-2 border-yellow-400 flex items-center justify-center px-2 py-1 shadow-md">
                                            <span className="text-yellow-100 text-xs font-bold">
                                                {cardInfo.attack}/<span className="text-blue-300">{cardInfo.defense}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card type display (MIDDLE RIGHT) - Improved styling */}
                                    <div className="absolute right-2 top-1/3 flex flex-col gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-900 to-purple-600 border-2 border-yellow-300 flex items-center justify-center text-white text-xs shadow-lg transform hover:scale-110 transition-transform" 
                                             title={cardInfo.type} style={{boxShadow: '0 0 6px rgba(147, 51, 234, 0.7)'}}>
                                            <span className="font-bold">{cardInfo.type?.charAt(0) || 'M'}</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-900 to-green-600 border-2 border-yellow-300 flex items-center justify-center text-white text-xs shadow-lg transform hover:scale-110 transition-transform"
                                             title={cardInfo.subtype} style={{boxShadow: '0 0 6px rgba(16, 185, 129, 0.7)'}}>
                                            <span className="font-bold">{cardInfo.subtype?.charAt(0) || 'S'}</span>
                                        </div>
                                    </div>

                                    {/* Spacer to push name to bottom */}
                                    <div className="flex-grow"></div>

                                    {/* Card name (CENTER BOTTOM) - Improved styling */}
                                    <div className="bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 mx-2 mb-2 rounded-md flex items-center justify-center px-3 py-2 border border-yellow-300 shadow-md">
                                        <span className="text-sm font-bold text-black leading-tight text-center" style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: '2',
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textShadow: '0 1px 0 rgba(255, 255, 255, 0.3)'
                                        }}>
                                            {cardInfo.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Back of card - Improved styling */}
                        <div className={`absolute inset-0 backface-hidden ${cardFacing === 'front' ? 'opacity-0' : 'opacity-100'} flex items-center justify-center transition-opacity duration-500`} style={{
                            transform: 'rotateY(180deg)'
                        }}>
                            <div className="w-full h-full">
                                <div className="w-full h-full rounded-lg overflow-hidden border-4 border-yellow-300 bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center" style={{
                                    backgroundImage: 'repeating-linear-gradient(-45deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 10px, rgba(0,0,0,0) 10px, rgba(0,0,0,0) 20px)'
                                }}>
                                    <div className="w-32 h-32 rounded-full border-8 border-yellow-500 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-xl card-emblem">
                                        <div className="text-3xl font-bold text-red-900" style={{textShadow: '0 1px 0 rgba(255, 215, 0, 0.5)'}}>★</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls - improved styling */}
                    <div className="flex justify-center gap-4 text-white text-xs z-10 mt-6">
                        <button
                            className="bg-gradient-to-r from-green-900 via-green-700 to-green-900 px-3 py-1.5 rounded-md border-2 border-yellow-300 flex items-center gap-2 shadow-lg hover:from-green-800 hover:to-green-600 transform transition-all"
                            onClick={toggleCardFace}
                            style={{boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)'}}
                        >
                            <span className="bg-black bg-opacity-70 rounded-full w-6 h-6 flex items-center justify-center border border-green-400 glow-green">↻</span>
                            <span className="text-yellow-200 font-bold">Flip</span>
                        </button>
                        <button
                            className="bg-gradient-to-r from-purple-900 via-purple-700 to-purple-900 px-3 py-1.5 rounded-md border-2 border-yellow-300 flex items-center gap-2 shadow-lg hover:from-purple-800 hover:to-purple-600 transform transition-all"
                            onClick={toggleHolographic}
                            style={{boxShadow: '0 0 10px rgba(147, 51, 234, 0.3)'}}
                        >
                            <span className="bg-black bg-opacity-70 rounded-full w-6 h-6 flex items-center justify-center border border-purple-400 glow-purple">✦</span>
                            <span className="text-yellow-200 font-bold">Holo</span>
                        </button>
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
        </div>
    );
};

window.CardDisplay = CardDisplay;