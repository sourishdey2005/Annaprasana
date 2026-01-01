
import React from 'react';
import { FoodScan } from '../types';
import { ArrowLeft, Share2, Plus, RefreshCcw, Droplet, Zap, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

interface NutritionCardProps {
  scan: FoodScan;
  onClose: () => void;
  onRescan: () => void;
}

const NutritionCard: React.FC<NutritionCardProps> = ({ scan, onClose, onRescan }) => {
  const data = [
    { name: 'Protein', value: scan.protein, color: '#FF9933' },
    { name: 'Carbs', value: scan.carbs, color: '#FFBD59' },
    { name: 'Fats', value: scan.fats, color: '#FFDE59' },
  ];

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto animate-in slide-in-from-bottom duration-500">
      <div className="relative h-64 w-full">
        <img src={scan.imageBase64} alt={scan.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20"></div>
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition-all"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="relative -mt-10 bg-white rounded-t-[40px] px-6 pt-10 pb-20 shadow-[0_-15px_30px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="heading-vedic text-3xl font-bold text-gray-800">{scan.name}</h1>
            <p className="text-gray-400 text-sm mt-1">Sattvic analysis complete</p>
          </div>
          <button className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-saffron transition-colors">
            <Share2 size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-orange-50/50 p-5 rounded-3xl border border-orange-100 flex flex-col justify-between">
            <span className="text-saffron font-bold text-4xl">{scan.calories}</span>
            <span className="text-gray-500 text-xs font-medium uppercase tracking-wider mt-1">KCAL TOTAL</span>
          </div>
          <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 space-y-3">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Target size={14} className="text-blue-500" />
                   <span className="text-[10px] font-bold text-gray-400">VITAMINS</span>
                </div>
                <span className="text-[10px] font-bold text-blue-500">OPTIMAL</span>
             </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Droplet size={14} className="text-teal-500" />
                   <span className="text-[10px] font-bold text-gray-400">PRANA</span>
                </div>
                <span className="text-[10px] font-bold text-teal-500">HIGH</span>
             </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Macronutrients</h3>
            <span className="text-xs text-gray-400">Vedic Balance: Harmonized</span>
          </div>
          
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 0, right: 30 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-4">
            {data.map(item => (
              <div key={item.name} className="text-center p-3 rounded-2xl border border-gray-50">
                <div className="text-lg font-bold text-gray-800">{item.value}g</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest">{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 bg-gray-100 text-gray-800 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
            <Plus size={20} /> Add to Log
          </button>
          <button 
            onClick={onRescan}
            className="flex-1 bg-saffron text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-100 hover:bg-orange-500 transition-colors"
          >
            <RefreshCcw size={20} /> Rescan
          </button>
        </div>
      </div>
    </div>
  );
};

export default NutritionCard;
