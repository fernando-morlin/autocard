// src/components/HandDisplay.js
const HandDisplay = ({ generatedCard, cardsInHand }) => {
    return (
      <div className="mt-4 bg-gradient-to-b from-gray-900 to-blue-900 border-2 border-yellow-300 rounded-lg p-3 overflow-x-auto">
        <div className="text-xs text-yellow-300 mb-2">Cartas em Mão ({cardsInHand}):</div>
        <div className="flex space-x-2">
          {/* Show generated card in hand if available */}
          {generatedCard && (
            <div className="relative min-w-[60px] h-24 transform hover:scale-110 hover:-translate-y-2 transition-transform cursor-pointer">
              <img
                src={generatedCard}
                alt="Card in hand"
                className="w-full h-full object-cover rounded-md border-2 border-yellow-400"
              />
            </div>
          )}
  
          {/* Placeholder cards for the rest of the hand */}
          {Array.from({ length: Math.max(0, cardsInHand - (generatedCard ? 1 : 0)) }).map((_, index) => (
            <div
              key={index}
              className="relative min-w-[60px] h-24 bg-gradient-to-br from-red-900 to-red-700 rounded-md border-2 border-yellow-400 transform hover:scale-110 hover:-translate-y-2 transition-transform cursor-pointer"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-xl font-bold text-yellow-500">★</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  window.HandDisplay = HandDisplay;