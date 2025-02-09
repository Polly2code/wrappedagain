
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

export const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile?.name.endsWith('.txt')) {
      setFile(uploadedFile);
      toast.success('Chat file uploaded successfully!');
    } else {
      toast.error('Please upload a valid WhatsApp chat export file (.txt)');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/plain': ['.txt'],
    },
    maxFiles: 1
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out animate-fade-up
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
          }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="p-4 rounded-full bg-primary/10">
            {file ? <FileText className="w-8 h-8 text-primary" /> : <Upload className="w-8 h-8 text-primary" />}
          </div>
          <div>
            {file ? (
              <>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </>
            ) : (
              <>
                <p className="font-medium">Drop your WhatsApp chat export here</p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to select file
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
