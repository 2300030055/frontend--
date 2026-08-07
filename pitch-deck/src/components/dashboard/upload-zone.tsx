"use client";

import { useCallback, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileSelect?: (fileName: string) => void;
}

export function UploadZone({ onFileSelect }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      onFileSelect?.(file.name);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearFile = useCallback(() => {
    setFileName(null);
  }, []);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 transition-all",
        isDragging
          ? "border-violet-500 bg-violet-50/50"
          : "border-slate-300/80 bg-white/40 hover:border-violet-300",
        fileName && "border-solid border-violet-200 bg-violet-50/30"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      role="region"
      aria-label="Upload README file"
    >
      {fileName ? (
        <>
          <FileText className="mb-3 h-10 w-10 text-violet-600" aria-hidden="true" />
          <p className="text-sm font-medium text-slate-900">{fileName}</p>
          <p className="mt-1 text-xs text-slate-500">Ready to generate</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3"
            onClick={clearFile}
            aria-label="Remove uploaded file"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Remove
          </Button>
        </>
      ) : (
        <>
          <Upload className="mb-3 h-10 w-10 text-violet-500" aria-hidden="true" />
          <p className="text-sm font-medium text-slate-700">
            Drag & drop your README here
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Supports .md, .txt, .markdown
          </p>
          <label className="mt-4 cursor-pointer">
            <span className="sr-only">Choose README file</span>
            <input
              type="file"
              accept=".md,.txt,.markdown"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <Button variant="secondary" size="sm" type="button" asChild>
              <span>Browse Files</span>
            </Button>
          </label>
        </>
      )}
    </div>
  );
}
