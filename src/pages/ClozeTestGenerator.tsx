import React, { useState } from 'react';

type Mode = 'keyword' | 'random' | 'custom';

const ClozeTestGenerator: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [clozeText, setClozeText] = useState<string[]>([]);
    const [selectedMode, setSelectedMode] = useState<Mode>('keyword');
    const [customCount, setCustomCount] = useState(3);

    // Hàm để đếm số từ
    const wordCount = inputText.trim() === '' ? 0 : inputText.split(' ').length;

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(e.target.value);
    };

    const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMode(e.target.value as Mode);
    };

    const handleGenerateCloze = () => {
        const words = inputText.split(' ');

        let clozeWords: string[] = [];

        switch (selectedMode) {
            case 'keyword':
                // Chế độ từ khóa - Tự động thay thế các từ dài hơn 4 ký tự
                clozeWords = words.map(word => (word.length > 4 ? '_____' : word));
                break;

            case 'random':
                // Chế độ ngẫu nhiên - Thay thế ngẫu nhiên một số từ
                clozeWords = words.map(word =>
                    Math.random() > 0.5 ? '_____' : word
                );
                break;

            case 'custom':
                // Chế độ tùy chỉnh - Thay thế đúng số lượng từ được người dùng chỉ định
                const toRemove = Math.min(customCount, words.length);
                let indicesToRemove = new Set<number>();
                while (indicesToRemove.size < toRemove) {
                    indicesToRemove.add(Math.floor(Math.random() * words.length));
                }
                clozeWords = words.map((word, index) =>
                    indicesToRemove.has(index) ? '_____' : word
                );
                break;

            default:
                clozeWords = words;
                break;
        }

        setClozeText(clozeWords);
    };

    // Hàm để xuất bản thành file .txt
    const handleExportToFile = () => {
        const element = document.createElement('a');
        const file = new Blob([clozeText.join(' ')], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'cloze_test.txt';
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="container mx-auto p-6 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6 text-center">Cloze Test Generator</h1>

            {/* Input Text Area */}
            <textarea
                value={inputText}
                onChange={handleInputChange}
                placeholder="Enter your text here..."
                className="w-full p-3 border border-gray-300 rounded-md mb-4"
                rows={5}
            />

            {/* Word Count */}
            <div className="text-right text-gray-600 mb-4">Word count: {wordCount}</div>

            {/* Mode Selection */}
            <div className="flex justify-between items-center mb-4">
                <label className="text-lg font-medium">Choose Mode:</label>
                <select
                    value={selectedMode}
                    onChange={handleModeChange}
                    className="p-2 border border-gray-300 rounded-md"
                >
                    <option value="keyword">Keyword Mode</option>
                    <option value="random">Random Mode</option>
                    <option value="custom">Custom Mode</option>
                </select>
            </div>

            {/* Custom Mode: Number of blanks */}
            {selectedMode === 'custom' && (
                <div className="flex justify-between items-center mb-4">
                    <label className="text-lg font-medium">Number of Blanks:</label>
                    <input
                        type="number"
                        value={customCount}
                        onChange={(e) => setCustomCount(parseInt(e.target.value))}
                        className="w-20 p-2 border border-gray-300 rounded-md"
                        min={1}
                        max={inputText.split(' ').length}
                    />
                </div>
            )}

            {/* Generate Button */}
            <button
                onClick={handleGenerateCloze}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
            >
                Generate Cloze Test
            </button>

            {/* Export to File Button */}
            <button
                onClick={handleExportToFile}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full mt-4"
            >
                Export to .txt
            </button>

            {/* Display Cloze Test Result */}
            <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-2">Generated Cloze Test:</h2>
                <div className="p-3 border border-gray-300 rounded-md bg-white">
                    {clozeText.length > 0 ? (
                        <p>{clozeText.join(' ')}</p>
                    ) : (
                        <p className="text-gray-500">No test generated yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClozeTestGenerator;
 