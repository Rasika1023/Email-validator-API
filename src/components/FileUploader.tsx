
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  accept = ".csv",
  maxSize = 5 * 1024 * 1024, // 5MB default
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (file: File) => {
      // Check file type
      if (!file.name.endsWith('.csv')) {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
        return;
      }

      // Check file size
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `File size should not exceed ${maxSize / (1024 * 1024)}MB.`,
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    },
    [maxSize, onFileSelect, toast]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      
      const files = event.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileChange(files[0]);
      }
    },
    [handleFileChange]
  );

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging
          ? "border-primary bg-primary/5"
          : selectedFile
          ? "border-green-500 bg-green-50"
          : "border-muted-foreground/30 hover:border-muted-foreground/50"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept={accept}
        className="hidden"
        data-testid="file-input"
      />

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-muted p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-muted-foreground"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
        </div>

        {selectedFile ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">File selected:</p>
            <p className="text-sm font-semibold text-muted-foreground">{selectedFile.name}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleButtonClick}
              className="mt-2"
            >
              Change File
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <p className="text-base font-medium">
                Drag and drop your CSV file here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse (.csv files only)
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleButtonClick}
              className="mt-4"
            >
              Select CSV File
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
