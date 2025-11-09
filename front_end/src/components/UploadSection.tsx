import { useState } from 'react';
import { Upload, Loader2, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface UploadSectionProps {
  onAnalyze: (file: File, brand: string, mediaType: 'image' | 'video') => void;
  isLoading: boolean;
  mediaType: 'image' | 'video' | null;
}

const BRANDS = [
  { value: 'nike', label: 'Nike' },
  { value: 'apple', label: 'Apple' },
  { value: 'coca-cola', label: 'Coca-Cola' },
];

export const UploadSection = ({ onAnalyze, isLoading, mediaType }: UploadSectionProps) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    // Check file size (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'File size must be under 50MB',
        variant: 'destructive',
      });
      return;
    }

    // Check file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload JPG, PNG, MP4, MOV, or WebM',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    setFileType(isImage ? 'image' : 'video');
    setFileSize(file.size);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = () => {
    if (!selectedFile || !selectedBrand || !fileType) {
      toast({
        title: 'Missing information',
        description: 'Please select a brand and upload a file',
        variant: 'destructive',
      });
      return;
    }
    onAnalyze(selectedFile, selectedBrand, fileType);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
      <div className="bg-card rounded-2xl shadow-card-custom p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Select Brand</label>
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a brand to analyze..." />
            </SelectTrigger>
            <SelectContent>
              {BRANDS.map((brand) => (
                <SelectItem key={brand.value} value={brand.value}>
                  {brand.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Upload Ad Media</label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              isDragging
                ? 'border-primary bg-primary/5 scale-105'
                : 'border-border hover:border-primary/50 hover:bg-muted/30'
            }`}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-foreground font-medium mb-2">
              Drag and drop your ad image or video here
            </p>
            <p className="text-sm text-muted-foreground mb-4">or</p>
            <label className="cursor-pointer">
              <Button variant="secondary" asChild>
                <span>
                  Browse Files
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  />
                </span>
              </Button>
            </label>
            <p className="text-xs text-muted-foreground mt-4">
              Supports: JPG, PNG, MP4, MOV, WebM (Max 50MB)
            </p>
          </div>
        </div>

        {preview && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Preview</label>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {fileType === 'video' && <Video className="w-4 h-4" />}
                <span className="capitalize">{fileType}</span>
                <span>•</span>
                <span>{formatFileSize(fileSize)}</span>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden border border-border">
              {fileType === 'image' ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto max-h-96 object-contain bg-muted"
                />
              ) : (
                <video
                  src={preview}
                  controls
                  className="w-full h-auto max-h-96 object-contain bg-muted"
                />
              )}
            </div>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!selectedFile || !selectedBrand || isLoading}
          className="w-full h-12 text-base font-semibold bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {fileType === 'video' 
                ? 'Analyzing video with AI... This may take up to 30 seconds'
                : 'Analyzing image with AI...'}
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Analyze Ad
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
