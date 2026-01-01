
import React, { useEffect, useState } from 'react';
import { getAllScans, deleteScan } from '../db';
import { FoodScan } from '../types';
import { Trash2, Calendar, ChevronRight, Info } from 'lucide-react';

interface HistoryProps {
  onViewDetail: (scan: FoodScan) => void;
}

const History: React.FC<HistoryProps> = ({ onViewDetail }) => {
  const [scans, setScans] = useState<FoodScan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    setLoading(true);
    const data = await getAllScans();
    setScans(data);
    setLoading(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Delete this record?")) {
      await deleteScan(id);
      loadScans();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron"></div>
      </div>
    );
  }

  if (scans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 px-8 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Calendar className="text-gray-300 w-10 h-10" />
        </div>
        <h3 className="heading-vedic text-xl font-bold text-gray-800">No Meals Yet</h3>
        <p className="text-gray-500 text-sm mt-2">Your journey to mindful eating starts with your first scan.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto pb-24">
      <div className="flex items-center justify-between mb-2 px-2">
        <h2 className="heading-vedic text-2xl font-bold text-gray-800">Meal History</h2>
        <span className="text-xs font-medium bg-orange-100 text-saffron px-3 py-1 rounded-full">
          {scans.length} Scans
        </span>
      </div>
      
      {scans.map((scan) => (
        <div 
          key={scan.id}
          onClick={() => onViewDetail(scan)}
          className="group bg-white rounded-2xl p-3 flex items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
            <img src={scan.imageBase64} alt={scan.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-800 truncate">{scan.name}</h4>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-saffron"></span>
                {scan.calories} kcal
              </span>
              <span className="text-xs text-gray-400">
                {new Date(scan.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => handleDelete(e, scan.id)}
              className="p-2 text-gray-300 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
            <ChevronRight size={20} className="text-gray-300 group-hover:text-saffron transition-colors" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;
