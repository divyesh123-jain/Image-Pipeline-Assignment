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

  const {
    originalImage,
    handleFile,
    clearCanvas,
    generateMask,
    drawingColor,
    setDrawingColor,
  } = useCanvas(canvasRef, brushSize);

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
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const originalImg = new Image();
      const maskImg = new Image();

      originalImg.src = originalImage;
      maskImg.src = maskImage;

      originalImg.onload = () => {
        maskImg.onload = () => {
          const spacing = 60;
          const textHeight = 60;
          const padding = 60;

          canvas.width = Math.max(originalImg.width, maskImg.width);
          canvas.height =
            originalImg.height +
            maskImg.height +
            spacing +
            textHeight * 2 +
            padding * 2;

          if (context) {
            context.font = '40px Arial';
            context.fillStyle = 'white';
            context.textAlign = 'center';
          }

          context?.drawImage(originalImg, 0, 0);

          const originalTextX = canvas.width / 2;
          const originalTextY = originalImg.height + padding;
          context?.fillText('Original Image', originalTextX, originalTextY);

          const maskImageY = originalImg.height + textHeight + spacing;
          context?.drawImage(maskImg, 0, maskImageY);

          const maskTextX = canvas.width / 2;
          const maskTextY = maskImageY + maskImg.height + padding;
          context?.fillText('Mask Image', maskTextX, maskTextY);

          const exportedImage = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = exportedImage;
          link.download = 'exported-image.png';
          link.click();
          toast.success('Image exported successfully!');
        };
      };
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <BrushControls
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        drawingColor={drawingColor}
        setDrawingColor={setDrawingColor}

      />

      <div className="relative" onDrop={handleDrop} onDragOver={handleDragOver}>
        <canvas ref={canvasRef} className="border border-gray-300 rounded-lg" />
        {!originalImage && <UploadPrompt onUpload={handleImageUpload} />}
      </div>

      <CanvasControls
        onClear={clearCanvas}
        onGenerate={() => {
          const maskImage = generateMask();
          if (maskImage && originalImage) {
            onMaskGenerated(originalImage, maskImage);
            toast.success('Mask generated successfully!');
          }
        }}
        onExport={handleExport}
        hasImage={!!originalImage}
      />
    </div>
  );
};