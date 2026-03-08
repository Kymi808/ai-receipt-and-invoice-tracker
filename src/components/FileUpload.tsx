"use client";

import { useCallback, useState } from "react";

interface FileUploadProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export default function FileUpload({ onUpload, isLoading }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) onUpload(file);
    },
    [onUpload]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onUpload(file);
      e.target.value = "";
    },
    [onUpload]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
        dragOver
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-gray-400"
      } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
      onClick={() => document.getElementById("file-input")?.click()}
    >
      <input
        id="file-input"
        type="file"
        accept="image/*,.pdf"
        onChange={handleChange}
        className="hidden"
      />
      <div className="space-y-3">
        <div className="text-5xl">📄</div>
        {isLoading ? (
          <div>
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            <p className="mt-2 text-sm text-gray-500">
              Analyzing with AI...
            </p>
          </div>
        ) : (
          <>
            <p className="text-lg font-medium text-gray-700">
              Drop a receipt or invoice here
            </p>
            <p className="text-sm text-gray-500">
              or click to browse — supports images (JPEG, PNG) and PDFs
            </p>
          </>
        )}
      </div>
    </div>
  );
}
