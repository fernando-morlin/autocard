// src/components/CardInfoPanel.js
// CardInfoPanel.js

const CardInfoPanel = ({ cardInfo, highlightedOption, setHighlightedOption, infoTab, setInfoTab }) => {

    const menuOptions = ['SUMMON', 'SET', 'ACTIVATE', 'VIEW CARD', 'RETURN'];

    const handleMenuHover = (option) => {
        setHighlightedOption(option);
        if (option === 'VIEW CARD') {
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-900 to-blue-900 border-2 border-yellow-300 rounded-lg p-3 md:w-64 text-white shadow-lg">
            {/* Tab navigation */}
            <div className="flex border-b border-yellow-400 mb-3">
                <button
                    className={`px-3 py-1 text-xs ${infoTab === 'details' ? 'bg-yellow-600 text-white' : 'text-gray-400'}`}
                    onClick={() => setInfoTab('details')}
                >
                    Detalhes
                </button>
                <button
                    className={`px-3 py-1 text-xs ${infoTab === 'actions' ? 'bg-yellow-600 text-white' : 'text-gray-400'}`}
                    onClick={() => setInfoTab('actions')}
                >
                    Ações
                </button>
                <button
                    className={`px-3 py-1 text-xs ${infoTab === 'history' ? 'bg-yellow-600 text-white' : 'text-gray-400'}`}
                    onClick={() => setInfoTab('history')}
                >
                    Histórico
                </button>
            </div>

            {/* Tab content */}
            {infoTab === 'details' && (
                <>
                    {/* Card Details */}
                    <div className="border-b border-yellow-400 pb-2 mb-2">
                        <h3 className="text-yellow-300 font-bold">{cardInfo.name || 'CARD NAME'}</h3>
                        <div className="flex gap-1 my-1">
                            {Array.from({ length: cardInfo.rarity || 0 }).map((_, index) => (
                                <div key={index} className="text-yellow-400">★</div>
                            ))}
                        </div>
                        <div className="flex items-center gap-1 text-xs mb-1">
                            <div className="bg-purple-700 px-1 rounded">{cardInfo.type || 'TYPE'}</div>
                            <div className="bg-green-700 px-1 rounded">{cardInfo.subtype || 'SUBTYPE'}</div>
                        </div>
                        <div className="text-gray-300 text-xs opacity-75">ID: {cardInfo.cardId || 'MTD-BR000'}</div>
                    </div>

                    {/* Card Effect Text */}
                    <div className="text-xs mb-3 text-gray-100 h-40 overflow-y-auto">
                        <p className="mb-2"><span className="text-yellow-200">[{cardInfo.type || 'Card Type'}]</span></p>
                        <p className="mb-2">{cardInfo.effectText || 'No effect text generated.'}</p>
                        <p className="mt-2 italic text-xs text-gray-400">{cardInfo.flavorText || 'No flavor text.'}</p>
                    </div>

                    {/* Card Stats */}
                    <div className="flex justify-between border-t border-yellow-400 pt-2 text-sm">
                        <div>
                            <span className="text-yellow-300">ATK/</span>
                            <span>{cardInfo.attack || '0'}</span>
                        </div>
                        <div>
                            <span className="text-yellow-300">DEF/</span>
                            <span>{cardInfo.defense || '0'}</span>
                        </div>
                    </div>

                    {/* Additional card details */}
                    <div className="mt-2 flex justify-between text-xs text-gray-300">
                        <span>Raridade: {cardInfo.rarityText || 'Comum'}</span>
                        <span>Set: {cardInfo.setId || 'JRPG-00'}</span>
                    </div>
                </>
            )}

            {infoTab === 'actions' && (
                <div className="space-y-1">
                    {menuOptions.map(option => (
                        <button
                            key={option}
                            className={`w-full py-1 px-2 text-left flex justify-between text-sm
                            ${highlightedOption === option
                                ? 'bg-gradient-to-r from-yellow-600 to-yellow-800 text-white border border-yellow-300'
                                : 'bg-gray-800 bg-opacity-50 text-gray-300'}`}
                            onMouseEnter={() => handleMenuHover(option)}
                            onMouseLeave={() => setHighlightedOption(null)}
                        >
                            <span>{option}</span>
                            {highlightedOption === option && <span className="text-yellow-300">►</span>}
                        </button>
                    ))}
                </div>
            )}

            {infoTab === 'history' && (
                <div className="text-xs text-gray-300 h-64 overflow-y-auto">
                    <div className="mb-2 pb-1 border-b border-gray-700">
                        <span className="text-yellow-300">♦ Carta gerada:</span> {cardInfo.name}
                    </div>
                    <div className="italic text-gray-500">Nenhuma ação anterior.</div>
                </div>
            )}
        </div>
    );
};

window.CardInfoPanel = CardInfoPanel;