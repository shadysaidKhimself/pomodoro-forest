import { motion } from 'framer-motion';

export interface ForestHistoryItem {
  id: number;
  date: string;
  tree: string;
  top?: string;
  left?: string;
}

interface ForestSidebarProps {
  forestHistory: ForestHistoryItem[];
}

export default function ForestSidebar({ forestHistory }: ForestSidebarProps) {
  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 z-50 pointer-events-none">
      
      {/* Label on Hover */}
      <div className="absolute top-6 left-6 pointer-events-auto cursor-help group">
         <div className="px-4 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10 text-white/50 text-sm tracking-widest uppercase hover:bg-black/40 transition-all">
            My Forest
         </div>
      </div>

      {/* Tree Container - Full Sidebar Area */}
      <div className="absolute inset-0 top-20 left-4 w-full h-full pointer-events-none">
         {forestHistory.length === 0 && (
           <div className="text-4xl opacity-10 grayscale filter absolute top-10 left-10">🌲</div>
         )}
         {forestHistory.map((item, index) => (
           <motion.div 
             key={item.id}
             initial={{ scale: 0, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ delay: index * 0.05, type: "spring" }}
             className="absolute text-3xl cursor-help group/tree hover:z-50 hover:scale-125 transition-all duration-300 drop-shadow-lg pointer-events-auto"
             style={{ 
               top: item.top || `${(index * 40) % 90}%`, 
               left: item.left || `${(index * 20) % 80}%` 
             }}
           >
             {item.tree}
             
             {/* Tooltip */}
             <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-xs leading-relaxed text-white opacity-0 group-hover/tree:opacity-100 whitespace-nowrap pointer-events-none transition-all duration-200 z-[100] shadow-xl">
               <span className="opacity-80">{new Date(item.date).toLocaleDateString()}</span>
               <br/>
               <span className="opacity-60">{new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
             </div>
           </motion.div>
         ))}
      </div>
    </div>
  );
}
