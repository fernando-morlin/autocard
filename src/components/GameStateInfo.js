// src/components/GameStateInfo.js
// GameStateInfo.js

const GameStateInfo = () => {
    const [cardsInDeck, setCardsInDeck] = React.useState(42);
    const [cardsInHand, setCardsInHand] = React.useState(5);
    const [currentLP, setCurrentLP] = React.useState(4000);

    return (
        <div className="flex justify-between items-center mb-3 text-sm">
            <div className="bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg border border-yellow-500 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-600 border border-red-300 flex items-center justify-center">
                    <span className="text-white font-bold">LP</span>
                </div>
                <span className="text-yellow-400 font-bold">{currentLP}</span>
            </div>

            <div className="bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg border border-yellow-500 flex gap-4">
                <div className="flex items-center gap-1">
                    <div className="w-5 h-5 rounded-sm bg-blue-800 border border-blue-500"></div>
                    <span>{cardsInDeck}</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-4 h-5 bg-gradient-to-br from-red-800 to-red-600 border border-yellow-400 rounded-sm transform rotate-3"></div>
                        ))}
                    </div>
                    <span>{cardsInHand}</span>
                </div>
            </div>
        </div>
    );
};

window.GameStateInfo = GameStateInfo;