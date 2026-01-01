
import React, { useState, useEffect } from 'react';
import { Tab, FoodScan } from './types';
import Scanner from './components/Scanner';
import History from './components/History';
import NutritionCard from './components/NutritionCard';
import { LotusIcon } from './components/LotusIcon';
import { Home, Camera, History as HistoryIcon, User, Search } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SCAN);
  const [selectedScan, setSelectedScan] = useState<FoodScan | null>(null);
  const [isNewScan, setIsNewScan] = useState(false);

  const handleScanComplete = (scan: FoodScan) => {
    setSelectedScan(scan);
    setIsNewScan(true);
  };

  const Dashboard = () => (
    <div className="p-6 space-y-8 pb-24 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-vedic text-3xl font-bold text-gray-800">Radha Sharma</h1>
          <p className="text-gray-400 text-sm">Prana Level: Radiant ✨</p>
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-saffron p-0.5">
          <img src="https://picsum.photos/seed/user/200/200" className="w-full h-full rounded-full object-cover" alt="User Profile" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-6 rounded-[32px] text-white shadow-xl shadow-orange-100">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-medium bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md">Today's Intake</span>
          <LotusIcon className="w-6 h-6 text-white/40" />
        </div>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-5xl font-bold">1,420</span>
          <span className="text-lg opacity-80 mb-1">/ 2,100 kcal</span>
        </div>
        <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden mt-4">
          <div className="bg-white h-full" style={{ width: '68%' }}></div>
        </div>
        <div className="flex justify-between mt-4 text-[11px] font-bold uppercase tracking-widest opacity-80">
          <span>Sattvic (68%)</span>
          <span>Target Remaining: 680 kcal</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm">
           <div className="flex justify-between items-center mb-4">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-500"><Search size={18} /></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Analysis</span>
           </div>
           <h3 className="text-lg font-bold text-gray-800">Dosha Harmony</h3>
           <p className="text-xs text-gray-400 mt-1">Pitta-dominant today</p>
           <button className="w-full mt-4 py-2 px-4 bg-gray-50 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100">View Recommendations</button>
        </div>
        <div className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm">
           <div className="flex justify-between items-center mb-4">
              <div className="p-2 bg-green-50 rounded-xl text-green-500"><Home size={18} /></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Daily Wisdom</span>
           </div>
           <h3 className="text-lg font-bold text-gray-800">Food is Medicine</h3>
           <p className="text-xs text-gray-400 mt-1">When diet is correct, medicine is of no use.</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="heading-vedic text-xl font-bold text-gray-800">Recommended Recipes</h3>
          <button className="text-saffron text-sm font-bold">See All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {[
            { name: "Moong Dal Khichdi", img: "https://picsum.photos/seed/food1/300/200", kcal: "320" },
            { name: "Aloo Gobi Sattvic", img: "https://picsum.photos/seed/food2/300/200", kcal: "280" },
          ].map(recipe => (
            <div key={recipe.name} className="flex-shrink-0 w-64 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50">
              <img src={recipe.img} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h4 className="font-bold text-gray-800">{recipe.name}</h4>
                <p className="text-xs text-gray-400 mt-1">{recipe.kcal} kcal • 15 mins</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24 font-['Inter'] selection:bg-orange-100">
      <main className="max-w-md mx-auto min-h-screen relative overflow-x-hidden">
        {activeTab === Tab.DASHBOARD && <Dashboard />}
        {activeTab === Tab.SCAN && <Scanner onScanComplete={handleScanComplete} />}
        {activeTab === Tab.HISTORY && <History onViewDetail={setSelectedScan} />}

        {selectedScan && (
          <NutritionCard 
            scan={selectedScan} 
            onClose={() => {
              setSelectedScan(null);
              setIsNewScan(false);
            }} 
            onRescan={() => {
              setSelectedScan(null);
              setIsNewScan(false);
              setActiveTab(Tab.SCAN);
            }}
          />
        )}
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-4 flex justify-around items-center z-40 max-w-md mx-auto shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <button 
          onClick={() => setActiveTab(Tab.DASHBOARD)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.DASHBOARD ? 'text-saffron scale-110' : 'text-gray-300'}`}
        >
          <Home size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
        </button>
        
        <button 
          onClick={() => setActiveTab(Tab.SCAN)}
          className={`flex flex-col items-center transition-all ${activeTab === Tab.SCAN ? 'scale-125' : 'scale-100 opacity-60'}`}
        >
          <div className={`p-3 rounded-full ${activeTab === Tab.SCAN ? 'bg-saffron text-white shadow-lg shadow-orange-200 ring-4 ring-orange-50' : 'bg-gray-100 text-gray-400'}`}>
            <Camera size={24} />
          </div>
        </button>

        <button 
          onClick={() => setActiveTab(Tab.HISTORY)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === Tab.HISTORY ? 'text-saffron scale-110' : 'text-gray-300'}`}
        >
          <HistoryIcon size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">History</span>
        </button>
      </nav>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default App;
