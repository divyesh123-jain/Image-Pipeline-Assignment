import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface BrushControlsProps {
  brushSize: number;
  setBrushSize: (size: number) => void;
  drawingColor: string;
  setDrawingColor: (color: string) => void;
}

// Predefined color palette
const COLOR_PALETTE = [
  '#000000', // Black
  '#FF0000', // Red
  '#0000FF', // Blue
  '#00FF00', // Green
  '#FFA500'  // Orange
];

export const BrushControls: React.FC<BrushControlsProps> = ({ 
  brushSize, 
  setBrushSize, 
  drawingColor,
  setDrawingColor,

}) => {
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
      
      <div className="border-l border-gray-300 pl-2 ml-2 flex items-center gap-2">
        {COLOR_PALETTE.map((color) => (
          <button
            key={color}
            onClick={() => setDrawingColor(color)}
            className={`w-6 h-6 rounded-full border-2 ${
              drawingColor === color 
                ? 'border-blue-500 scale-110' 
                : 'border-transparent hover:border-gray-300'
            } transition-all`}
            style={{ backgroundColor: color }}
            aria-label={`Select ${color} color`}
          />
        ))}
      </div>

     
    </div>
  );
};