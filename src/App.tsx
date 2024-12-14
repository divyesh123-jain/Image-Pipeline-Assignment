import  { useState } from 'react';
import { Canvas } from './components/Canvas';
import { Brush } from 'lucide-react';
import { ImagePair } from './components/ImagePair';
function App() {
  const [imagePair, setImagePair] = useState<{
    original: string;
    mask: string;
  } | null>(null);

  const handleMaskGenerated = (originalImage: string, maskImage: string) => {
    setImagePair({
      original: originalImage,
      mask: maskImage,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brush className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Image Inpainting Widget</h1>
          </div>
          <p className="text-gray-600">
            Upload an image and draw on it to create a mask.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <Canvas onMaskGenerated={handleMaskGenerated} />
          {imagePair && (
            <ImagePair
              originalImage={imagePair.original}
              maskImage={imagePair.mask}
            />
          )}
      
        </div>
      </div>
    </div>
  );
}

export default App;