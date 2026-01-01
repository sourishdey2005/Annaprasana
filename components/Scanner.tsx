
import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { analyzeFoodImage } from '../geminiService';
import { saveScan } from '../db';
import { FoodScan } from '../types';
import { LotusIcon } from './LotusIcon';

interface ScannerProps {
  onScanComplete: (scan: FoodScan) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScanComplete }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeFoodImage(image);
      const newScan: FoodScan = {
        ...result,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        imageBase64: image
      };
      await saveScan(newScan);
      onScanComplete(newScan);
      setImage(null);
    } catch (err: any) {
      setError(err.message || "Failed to analyze meal. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-md mx-auto min-h-[70vh]">
      {!image && !loading && (
        <div className="text-center animate-in fade-in duration-700">
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-orange-100">
            <LotusIcon className="w-12 h-12 text-saffron" />
          </div>
          <h2 className="heading-vedic text-2xl font-bold text-gray-800 mb-2">Scan Your Meal</h2>
          <p className="text-gray-500 mb-8 text-sm">Nourish your body, understand your plate.</p>
          
          <div className="grid grid-cols-1 gap-4 w-full">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-saffron text-white rounded-2xl font-semibold shadow-lg shadow-orange-200 hover:bg-orange-500 transition-all active:scale-95"
            >
              <Camera size={20} />
              Take or Upload Photo
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>
      )}

      {image && !loading && (
        <div className="w-full flex flex-col gap-6 animate-in zoom-in-95 duration-300">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-square bg-gray-100">
            <img src={image} alt="To scan" className="w-full h-full object-cover" />
            <button 
              onClick={() => setImage(null)}
              className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full backdrop-blur-md hover:bg-black/60 transition-colors"
            >
              <Loader2 size={20} className="rotate-45" />
            </button>
          </div>
          
          <button 
            onClick={processImage}
            className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-saffron text-white rounded-2xl font-semibold shadow-lg shadow-orange-200 hover:bg-orange-500 transition-all"
          >
            <Sparkles size={20} />
            Analyze Nutrients
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-orange-100 border-t-saffron animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <LotusIcon className="w-12 h-12 text-saffron/50" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="heading-vedic text-xl font-bold text-gray-800">Consulting Vedic Wisdom...</h3>
            <p className="text-gray-500 text-sm mt-2">Identifying elements and energies in your food</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center border border-red-100 w-full">
          {error}
        </div>
      )}
    </div>
  );
};

export default Scanner;
