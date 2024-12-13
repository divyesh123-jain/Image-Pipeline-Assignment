import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface BrushControlsProps {
  brushSize: number;
  setBrushSize: (size: number) => void;
}

export const BrushControls: React.FC<BrushControlsProps> = ({ brushSize, setBrushSize }) => {
  return (
    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
      <button
        onClick={() => setBrushSize(Math.max(1, brushSize - 5))}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Decrease brush size"
      >
        <Minus size={20} />
      </button>
      <span className="w-12 text-center font-medium">{brushSize}px</span>
      <button
        onClick={() => setBrushSize(Math.min(100, brushSize + 5))}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Increase brush size"
      >
        <Plus size={20} />
      </button>
    </div>
  );
};