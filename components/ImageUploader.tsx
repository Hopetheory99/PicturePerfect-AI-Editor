
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon } from '../constants.tsx';

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (!file.type.startsWith('image/')) {
        setError('Invalid file type. Please upload an image (JPEG, PNG, GIF, WEBP).');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File is too large. Maximum size is 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        onImageUpload(reader.result as string);
      };
      reader.onerror = () => {
        setError('Failed to read the file.');
      }
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full h-full max-w-2xl mx-auto p-8 border-4 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200
        ${isDragActive ? 'border-indigo-500 bg-gray-700' : 'border-gray-600 hover:border-gray-500 bg-gray-800'}`}
    >
      <input {...getInputProps()} />
      <UploadIcon className="w-16 h-16 text-gray-500 mb-4" />
      {isDragActive ? (
        <p className="text-xl font-semibold text-indigo-400">Drop the image here...</p>
      ) : (
        <p className="text-xl font-semibold text-gray-300">Drag & drop an image here, or click to select</p>
      )}
      <p className="text-sm text-gray-400 mt-2">Supports JPEG, PNG, GIF, WEBP. Max 10MB.</p>
      {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
    </div>
  );
};
