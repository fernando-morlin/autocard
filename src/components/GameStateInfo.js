// src/components/GameStateInfo.js
// GameStateInfo.js

const GameStateInfo = () => {
    const [cardsInDeck, setCardsInDeck] = React.useState(42);
    const [cardsInHand, setCardsInHand] = React.useState(5);
    const [currentLP, setCurrentLP] = React.useState(4000);
    const [userName, setUserName] = React.useState("Player");

    return (
        <div className="flex justify-between items-center mb-6 bg-gray-900 bg-opacity-70 p-3 rounded-lg border-2 border-blue-500">
            <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-white shadow-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">P1</span>
                </div>
                <div>
                    <div className="text-blue-300 text-xs uppercase tracking-wider mb-1">Player Name</div>
                    <div className="text-white font-bold">{userName}</div>
                </div>
            </div>
            
            <div className="flex gap-6">
                <div className="game-stats-panel">
                    <div className="bg-red-900 bg-opacity-60 px-4 py-2 rounded-lg border border-red-500 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-red-400 border-2 border-red-300 flex items-center justify-center mr-2 shadow-glow-red">
                            <span className="text-white font-bold">LP</span>
                        </div>
                        <span className="text-red-100 text-xl font-bold">{currentLP}</span>
                    </div>
                </div>

                <div className="game-stats-panel">
                    <div className="bg-blue-900 bg-opacity-60 px-4 py-2 rounded-lg border border-blue-500 flex items-center gap-4">
                        <div className="flex items-center">
                            <div className="flex -space-x-1">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="w-6 h-8 bg-gradient-to-br from-blue-800 to-blue-600 border border-blue-300 rounded-md transform rotate-3"></div>
                                ))}
                            </div>
                            <span className="text-blue-100 font-bold ml-2">{cardsInDeck}</span>
                        </div>
                        
                        <div className="flex items-center">
                            <div className="flex -space-x-2">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="w-6 h-8 bg-gradient-to-br from-purple-600 to-pink-600 border border-purple-300 rounded-md transform rotate-3"></div>
                                ))}
                            </div>
                            <span className="text-purple-100 font-bold ml-2">{cardsInHand}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

window.GameStateInfo = GameStateInfo;