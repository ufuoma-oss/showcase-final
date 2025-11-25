
import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewModalProps {
  imageSrc: string | null;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageSrc, onClose }) => {
  if (!imageSrc) return null;
  
  return (
    <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 animate-fade-up" onClick={onClose}>
        <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
            <X className="w-8 h-8" />
        </button>
        <img src={imageSrc} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
    </div>
  );
};

export default ImagePreviewModal;
