import React, { useRef } from 'react';
import { BrushControls } from './BrushContols';
import { UploadPrompt } from './UploadPrompt';
import { CanvasControls } from './CanvasContols';
import { useCanvas } from './useCanvas';
import toast from 'react-hot-toast';

interface CanvasProps {
  onMaskGenerated: (originalImage: string, maskImage: string) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ onMaskGenerated }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brushSize, setBrushSize] = React.useState(20);
  
  const { originalImage, handleFile, clearCanvas, generateMask } = useCanvas(canvasRef, brushSize);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    } else {
      toast.error('Please upload an image file');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleExport = () => {
    const maskImage = generateMask();
    if (maskImage && originalImage) {
      onMaskGenerated(originalImage, maskImage);
      toast.success('Mask generated successfully!');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <BrushControls brushSize={brushSize} setBrushSize={setBrushSize} />
      
      <div 
        className="relative" 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <canvas 
          ref={canvasRef} 
          className="border border-gray-300 rounded-lg"
        />
        {!originalImage && <UploadPrompt onUpload={handleImageUpload} />}
      </div>
      
      <CanvasControls
        onClear={clearCanvas}
        onGenerate={handleExport}
        hasImage={!!originalImage}
      />
    </div>
  );
};