import { useEffect, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import toast from 'react-hot-toast';

export const useCanvas = (canvasRef: React.RefObject<HTMLCanvasElement>, brushSize: number) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<fabric.Image | null>(null);
  const [imageMetadata, setImageMetadata] = useState<{
    originalWidth: number,
    originalHeight: number,
    scale: number,
    left: number,
    top: number
  } | null>(null);
  const [drawingColor, setDrawingColor] = useState<string>('#000000');
  
  // State for undo/redo functionality
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Save canvas state
  const saveCanvasState = useCallback(() => {
    if (!canvas) return;

    const currentState = canvas.toDataURL();
    setHistory(prevHistory => {
      // If we're in the middle of the history and make a new change, 
      // truncate the future states
      const newHistory = prevHistory.slice(0, historyIndex + 1);
      return [...newHistory, currentState];
    });
    setHistoryIndex(prev => prev + 1);
  }, [canvas, historyIndex]);

  // Undo functionality
  const undo = useCallback(() => {
    if (!canvas || historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    const previousState = history[newIndex];

    fabric.Image.fromURL(previousState, (img) => {
      canvas.clear();
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      canvas.renderAll();
      setHistoryIndex(newIndex);
    });
  }, [canvas, history, historyIndex]);

  // Redo functionality
  const redo = useCallback(() => {
    if (!canvas || historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    const nextState = history[newIndex];

    fabric.Image.fromURL(nextState, (img) => {
      canvas.clear();
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      canvas.renderAll();
      setHistoryIndex(newIndex);
    });
  }, [canvas, history, historyIndex]);

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
        width: 600,
        height: 400,
        backgroundColor: '#f3f4f6'
      });

      fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.color = drawingColor;
      fabricCanvas.freeDrawingBrush.width = brushSize;

      // Add event listener to save state after drawing
      fabricCanvas.on('mouse:up', saveCanvasState);

      setCanvas(fabricCanvas);

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, []);

  // Update brush color and size
  useEffect(() => {
    if (canvas) {
      canvas.freeDrawingBrush.color = drawingColor;
      canvas.freeDrawingBrush.width = brushSize;
    }
  }, [brushSize, drawingColor, canvas]);

  const handleFile = (file: File) => {
    if (!canvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target?.result as string;
      setOriginalImage(imgUrl);
      
      const img = new Image();
      img.onload = () => {
        // Create fabric image
        fabric.Image.fromURL(imgUrl, (fabricImg) => {
          canvas.clear();
          
          const scale = Math.min(
            (canvas.width! - 40) / img.width,
            (canvas.height! - 40) / img.height
          );
          
          fabricImg.scale(scale);
          fabricImg.set({
            left: (canvas.width! - fabricImg.width! * scale) / 2,
            top: (canvas.height! - fabricImg.height! * scale) / 2,
            selectable: false,
            evented: false
          });
          
          // Store image metadata for precise mask generation
          setImageMetadata({
            originalWidth: img.width,
            originalHeight: img.height,
            scale: scale,
            left: (canvas.width! - fabricImg.width! * scale) / 2,
            top: (canvas.height! - fabricImg.height! * scale) / 2
          });

          setBackgroundImage(fabricImg);
          canvas.setBackgroundImage(fabricImg, canvas.renderAll.bind(canvas));
          canvas.renderAll();
          
          // Reset history when new image is uploaded
          setHistory([canvas.toDataURL()]);
          setHistoryIndex(0);
          
          toast.success('Image uploaded successfully!');
        });
      };
      img.src = imgUrl;
    };
    reader.readAsDataURL(file);
  };

  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
      if (backgroundImage) {
        canvas.setBackgroundImage(backgroundImage, canvas.renderAll.bind(canvas));
      }
      canvas.renderAll();
      
      // Reset history
      const currentState = canvas.toDataURL();
      setHistory([currentState]);
      setHistoryIndex(0);
      
      toast.success('Canvas cleared');
    }
  };


  const exportImage = () => {
    if (!originalImage || !backgroundImage || !imageMetadata) {
      toast.error('Please upload an image and generate a mask first');
      return null;
    }

    const exportCanvas = document.createElement('canvas');
  exportCanvas.width = imageMetadata.originalWidth;
  exportCanvas.height = imageMetadata.originalHeight;
  const ctx = exportCanvas.getContext('2d')!;

  // Draw the original image
  const img = new Image();
  img.src = originalImage;
  img.onload = () => {
    ctx.drawImage(img, 0, 0, imageMetadata.originalWidth, imageMetadata.originalHeight);

    // Generate the mask image
    const maskDataUrl = generateMask();
    if (maskDataUrl) {
      const maskImg = new Image();
      maskImg.src = maskDataUrl;
      maskImg.onload = () => {
        // Draw the mask image on top of the original image
        ctx.drawImage(maskImg, 0, 0, imageMetadata.originalWidth, imageMetadata.originalHeight);

        // Export the combined image as a data URL
        const combinedImageDataUrl = exportCanvas.toDataURL('image/png');
        // You can now use this data URL to download the image or display it
        const link = document.createElement('a');
        link.href = combinedImageDataUrl;
        link.download = 'combined_image.png';
        link.click();
        toast.success('Image exported successfully!');
      };
    }
  };
};

  const generateMask = () => {
    if (!canvas || !originalImage || !backgroundImage || !imageMetadata) {
      toast.error('Please upload an image first');
      return null;
    }

    // Create a canvas with the original image dimensions
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = imageMetadata.originalWidth;
    tempCanvas.height = imageMetadata.originalHeight;
    const ctx = tempCanvas.getContext('2d')!;

    // Draw the original image
    const img = new Image();
    img.src = originalImage;
    ctx.drawImage(img, 0, 0, imageMetadata.originalWidth, imageMetadata.originalHeight);

    // Draw a semi-transparent black overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw the paths in white, scaled and positioned relative to original image
    const objects = canvas.getObjects();
    ctx.strokeStyle = 'white';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    objects.forEach(obj => {
      if (obj instanceof fabric.Path) {
        const path = obj as fabric.Path;
        ctx.lineWidth = path.strokeWidth! / imageMetadata.scale;

        ctx.beginPath();
        const pathData = path.path;
        if (pathData) { 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pathData.forEach((point: any) => {
            const scaledX = (point[1] - imageMetadata.left) / imageMetadata.scale;
            const scaledY = (point[2] - imageMetadata.top) / imageMetadata.scale;
        
            if (point[0] === 'M') {
              ctx.moveTo(scaledX, scaledY);
            } else if (point[0] === 'L') {
              ctx.lineTo(scaledX, scaledY);
            } else if (point[0] === 'Q') {
              const scaledCX = (point[1] - imageMetadata.left) / imageMetadata.scale;
              const scaledCY = (point[2] - imageMetadata.top) / imageMetadata.scale;
              const scaledX2 = (point[3] - imageMetadata.left) / imageMetadata.scale;
              const scaledY2 = (point[4] - imageMetadata.top) / imageMetadata.scale;
              ctx.quadraticCurveTo(scaledCX, scaledCY, scaledX2, scaledY2);
            }
          });
        }
        ctx.stroke();
      }
    });

    return tempCanvas.toDataURL('image/png');
  };

  return {
canvas,
    originalImage,
    undo,
    redo,
    exportImage,
    handleFile,
    clearCanvas,
    generateMask,
    drawingColor,
    setDrawingColor
  };
};