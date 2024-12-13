import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Minus, Plus, PenTool } from 'lucide-react';

interface CanvasProps {
  onMaskGenerated: (originalImage: string, maskImage: string) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ onMaskGenerated }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [brushSize, setBrushSize] = useState(20);
  const [brushColor, setBrushColor] = useState('white');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
        width: 600,
        height: 400,
      });

      fabricCanvas.freeDrawingBrush.color = brushColor;
      fabricCanvas.freeDrawingBrush.width = brushSize;
      fabricCanvas.backgroundColor = 'black';

      setCanvas(fabricCanvas);

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (canvas) {
      canvas.freeDrawingBrush.width = brushSize;
      canvas.freeDrawingBrush.color = brushColor;
    }
  }, [brushSize, brushColor, canvas]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgUrl = event.target?.result as string;
        setOriginalImage(imgUrl);

        fabric.Image.fromURL(imgUrl, (img) => {
          canvas.clear();
          canvas.backgroundColor = 'black';

          const scale = Math.min(
            canvas.width! / img.width!,
            canvas.height! / img.height!
          );

          img.scale(scale);
          img.set({
            left: (canvas.width! - img.width! * scale) / 2,
            top: (canvas.height! - img.height! * scale) / 2,
            selectable: false,
            opacity: 0.5,
          });

          canvas.add(img);
          canvas.renderAll();
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    if (canvas && originalImage) {
      const maskImage = canvas.toDataURL({
        format: 'png',
        quality: 1,
      });
      onMaskGenerated(originalImage, maskImage);
    }
  };

  const handleClear = () => {
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = 'black';
      canvas.renderAll();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4 items-center mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setBrushSize(Math.max(1, brushSize - 5))}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Minus size={20} />
          </button>
          <span className="w-12 text-center">{brushSize}px</span>
          <button
            onClick={() => setBrushSize(Math.min(100, brushSize + 5))}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <PenTool size={20} />
          </button>
          {showColorPicker && (
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg z-10">
              <div className="flex gap-2">
                {['white', 'red', 'blue', 'green', 'yellow', 'black'].map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setBrushColor(color);
                      setShowColorPicker(false);
                    }}
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="border border-gray-300 rounded-lg" />

      <div className="flex gap-4">
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Clear Canvas
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          disabled={!originalImage}
        >
          Generate Mask
        </button>
      </div>
    </div>
  );
};
