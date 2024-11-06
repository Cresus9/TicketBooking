import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, File } from 'lucide-react';
import { uploadService } from '../../services/uploadService';

interface FileUploaderProps {
  onUpload: (filename: string) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSize?: number;
}

export default function FileUploader({
  onUpload,
  onError,
  accept = 'image/*,application/pdf',
  maxSize = 5 * 1024 * 1024 // 5MB
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    const validation = uploadService.validateFile(file);
    if (!validation.valid) {
      onError?.(validation.error!);
      return;
    }

    setIsUploading(true);
    try {
      const filename = await uploadService.uploadFile(file);
      onUpload(filename);
    } catch (error) {
      onError?.(error.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleFileSelect}
      />

      <div className="space-y-4">
        <div className="flex justify-center">
          {accept.includes('image') ? (
            <ImageIcon className="h-12 w-12 text-gray-400" />
          ) : (
            <File className="h-12 w-12 text-gray-400" />
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            {isDragging ? 'Drop your file here' : 'Drag and drop your file here'}
          </p>
          <p className="text-sm text-gray-500">or</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 disabled:opacity-50"
          >
            <Upload className="h-5 w-5" />
            {isUploading ? 'Uploading...' : 'Browse Files'}
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Maximum file size: {maxSize / 1024 / 1024}MB
        </p>
      </div>
    </div>
  );
}