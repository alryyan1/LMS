import React, { useState } from 'react';

interface ToothData {
  id: number;
  condition: 'healthy' | 'decayed' | 'filled' | 'missing';
  notes: string;
}

const initialTeethData: ToothData[] = Array.from({ length: 32 }, (_, index) => ({
  id: index + 1,
  condition: 'healthy',
  notes: '',
}));

export default function ToothChart() {
  const [teethData, setTeethData] = useState<ToothData[]>(initialTeethData);
  const [selectedTooth, setSelectedTooth] = useState<ToothData | null>(null);

  const handleToothClick = (tooth: ToothData) => {
    setSelectedTooth(tooth);
  };

  const updateToothCondition = (condition: ToothData['condition']) => {
    if (!selectedTooth) return;
    
    setTeethData(prev => prev.map(tooth => 
      tooth.id === selectedTooth.id 
        ? { ...tooth, condition } 
        : tooth
    ));
  };

  const updateToothNotes = (notes: string) => {
    if (!selectedTooth) return;
    
    setTeethData(prev => prev.map(tooth => 
      tooth.id === selectedTooth.id 
        ? { ...tooth, notes } 
        : tooth
    ));
  };

  const getToothColor = (condition: ToothData['condition']) => {
    switch (condition) {
      case 'healthy': return 'bg-white';
      case 'decayed': return 'bg-red-400';
      case 'filled': return 'bg-gray-400';
      case 'missing': return 'bg-transparent';
      default: return 'bg-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Interactive Dental Chart
        </h1>

        {/* Upper Teeth */}
        <div className="mb-12">
          <div className="flex justify-center gap-1">
            {teethData.slice(0, 16).map(tooth => (
              <div
                key={tooth.id}
                onClick={() => handleToothClick(tooth)}
                className={`w-10 h-14 border-2 ${
                  tooth.id === selectedTooth?.id ? 'border-blue-500' : 'border-gray-300'
                } ${getToothColor(tooth.condition)} 
                cursor-pointer rounded-t-full bg-white shadow-md transition-colors duration-200 hover:border-blue-300`}
              >
                <div className="text-center text-sm mt-1">{tooth.id}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Lower Teeth */}
        <div>
          <div className="flex justify-center gap-1">
            {teethData.slice(16).map(tooth => (
              <div
                key={tooth.id}
                onClick={() => handleToothClick(tooth)}
                className={`w-10 h-14 border-2 ${
                  tooth.id === selectedTooth?.id ? 'border-blue-500' : 'border-gray-300'
                } ${getToothColor(tooth.condition)} 
                cursor-pointer rounded-b-full bg-white shadow-md transition-colors duration-200 hover:border-blue-300`}
              >
                <div className="text-center text-sm mt-8">{tooth.id}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Control Panel */}
        {selectedTooth && (
          <div className="mt-8 p-6 border-2 border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Tooth #{selectedTooth.id}
            </h2>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => updateToothCondition('healthy')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Healthy
              </button>
              <button
                onClick={() => updateToothCondition('decayed')}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Decayed
              </button>
              <button
                onClick={() => updateToothCondition('filled')}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Filled
              </button>
              <button
                onClick={() => updateToothCondition('missing')}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900"
              >
                Missing
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={selectedTooth.notes}
                onChange={(e) => updateToothNotes(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}