import React from 'react';

interface CanvasControlsProps {
  onClear: () => void;
  onGenerate: () => void;
  hasImage: boolean;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  onClear,
  onGenerate,
  hasImage,
}) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={onClear}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Clear Canvas
      </button>
      <button
        onClick={onGenerate}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!hasImage}
      >
        Generate Mask
      </button>
    </div>
  );
};