
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface DropZoneProps {
  file: File | null;
  isProcessing: boolean;
  setFile: (file: File) => void;
}

export const DropZone = ({ file, isProcessing, setFile }: DropZoneProps) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile?.name.endsWith('.txt')) {
      setFile(uploadedFile);
      toast.success('Chat file uploaded successfully!');
    } else if (uploadedFile?.name.endsWith('.zip')) {
      toast.info('Processing zip file...');
      setFile(uploadedFile);
      toast.success('Zip file uploaded successfully!');
    } else {
      toast.error('Please upload a valid WhatsApp chat export file (.txt) or zip file');
    }
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/zip': ['.zip'],
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out animate-fade-up
        ${isDragActive 
          ? 'border-primary bg-primary/5' 
          : 'border-gray-300 hover:border-primary/50 hover:bg-gradient-to-r hover:from-transparent hover:to-primary/20'
        }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-4 rounded-full bg-primary/10 w-20 h-20 flex items-center justify-center">
          {isProcessing ? (
            <img 
              src="/party_animal.gif" 
              alt="Processing" 
              className="w-full h-full object-cover rounded-full"
            />
          ) : file ? (
            <FileText className="w-8 h-8 text-primary" />
          ) : (
            <Upload className="w-8 h-8 text-primary" />
          )}
        </div>
        <div>
          {isProcessing ? (
            <p className="font-medium">Analyzing your chat...</p>
          ) : file ? (
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
                Accepts .txt or .zip files
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
