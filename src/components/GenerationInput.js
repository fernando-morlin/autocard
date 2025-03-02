// src/components/GenerationInput.js
// GenerationInput.js
const GenerationInput = ({ userDescription, setUserDescription, handleGenerateCard, isGenerating }) => {
    return (
        <div className="w-full mb-4 flex">
            <div className="relative flex-grow">
                <input
                    type="text"
                    className="w-full px-3 py-3 pl-10 bg-gray-900 text-white border-2 border-yellow-400 rounded-l focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Describe your card..."
                    value={userDescription}
                    onChange={(e) => setUserDescription(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateCard()}
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
                onClick={handleGenerateCard}
                disabled={isGenerating}
            >
                <div className="mr-2 w-5 h-5 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
                    <span className="text-yellow-300">⚡</span>
                </div>
                {isGenerating ? 'Gerando...' : 'Gerar Carta'}
            </button>
        </div>
    );
};

window.GenerationInput = GenerationInput;