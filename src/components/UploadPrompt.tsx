import React from 'react';
import { Upload } from 'lucide-react';

interface UploadPromptProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadPrompt: React.FC<UploadPromptProps> = ({ onUpload }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90 rounded-lg">
      <div className="text-center p-6">
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={onUpload}
          className="hidden"
        />
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center gap-4 cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
            <Upload className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700">
              Drop an image here or click to upload
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supports JPEG and PNG formats
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};