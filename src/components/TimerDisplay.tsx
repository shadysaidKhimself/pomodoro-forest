import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type TimerStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'FAILED';
export type SoundType = 'rain' | 'fire';

interface TimerDisplayProps {
  status: TimerStatus;
  treeEmoji: string | null;
  formattedTime: string;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onGiveUp: () => void;
  soundType: SoundType;
  setSoundType: React.Dispatch<React.SetStateAction<SoundType>>;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TimerDisplay({ 
  status, 
  treeEmoji, 
  formattedTime,
  onStart, 
  onPause, 
  onReset, 
  onGiveUp, 
  soundType, 
  setSoundType, 
  isMuted, 
  setIsMuted 
}: TimerDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12 relative z-10 max-w-md mx-auto py-12">
      {/* Messages */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        key={status}
        className="h-8 text-lg font-light tracking-[0.2em] text-[#E8F5E9]/70 uppercase text-center"
      >
        {status === 'IDLE' && "Plant a seed of focus"}
        {status === 'RUNNING' && "Breathe & Focus"}
        {status === 'PAUSED' && "Pause & Reflect"}
        {status === 'COMPLETED' && "Mindfulness Achieved"}
        {status === 'FAILED' && "Try Again"}
      </motion.div>

      {/* Land & Tree */}
      <div className="relative flex items-center justify-center group">
        {/* Land Circle - Glassmorphism */}
        <div className="w-72 h-72 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl flex items-center justify-center overflow-visible relative transition-all duration-700 ease-out group-hover:bg-white/10">
           
           {/* Inner Glow */}
           <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#4CAF50]/20 to-transparent opacity-50" />

           {/* Ripple effects when running */}
           {status === 'RUNNING' && (
             <>
               <motion.div
                 animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0, 0.1] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute w-full h-full rounded-full border border-[#4CAF50]/30"
               />
               <motion.div
                 animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.05, 0.1] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 className="absolute w-full h-full rounded-full bg-[#4CAF50]/5"
               />
             </>
           )}
           
           {/* Tree Emoji */}
           <AnimatePresence mode='wait'>
             {treeEmoji && (
               <motion.div
                 key={treeEmoji}
                 initial={{ scale: 0.8, y: 10, opacity: 0, filter: "blur(10px)" }}
                 animate={{ scale: 1, y: 0, opacity: 1, filter: "blur(0px)" }}
                 exit={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                 className="text-9xl select-none relative z-10 drop-shadow-2xl"
                 transition={{ duration: 0.8, ease: "easeOut" }}
               >
                 {treeEmoji}
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-7xl font-extralight tracking-widest tabular-nums text-white/90 drop-shadow-lg font-sans">
        {formattedTime}
      </div>

      {/* Control Group */}
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Main Controls */}
        <div className="flex gap-6 justify-center w-full">
          {status === 'IDLE' && (
            <button 
              onClick={onStart}
              className="px-10 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full text-lg tracking-widest font-light transition-all shadow-[0_0_15px_rgba(76,175,80,0.1)] hover:shadow-[0_0_25px_rgba(76,175,80,0.3)] hover:-translate-y-0.5 active:scale-95"
            >
              BEGIN
            </button>
          )}

          {(status === 'RUNNING' || status === 'PAUSED') && (
            <>
              {status === 'RUNNING' ? (
                <button onClick={onPause} className="px-8 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/90 tracking-wider font-light transition-all">
                  Pause
                </button>
              ) : (
                <button onClick={onStart} className="px-8 py-2 bg-[#4CAF50]/80 hover:bg-[#4CAF50] border border-transparent rounded-full text-white tracking-wider font-light transition-all shadow-lg">
                  Resume
                </button>
              )}
              
              <button onClick={onGiveUp} className="px-8 py-2 border border-red-300/30 text-red-200/80 hover:bg-red-400/10 rounded-full tracking-wider font-light transition-all">
                Give Up
              </button>
            </>
          )}

          {(status === 'COMPLETED' || status === 'FAILED') && (
            <button 
              onClick={onReset}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full text-lg tracking-widest font-light transition-all shadow-lg"
            >
              NEW SESSION
            </button>
          )}
        </div>
        
        {/* Sound Status Text */}
        <div className="h-6 flex items-center justify-center text-xs tracking-widest text-[#E8F5E9]/40 uppercase">
            {!isMuted && status === 'RUNNING' && (
                <motion.span 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex items-center gap-2"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400/50 animate-pulse"/>
                    {soundType === 'rain' ? 'Rain Sounds' : 'Fireplace'}
                </motion.span>
            )}
        </div>

        {/* Sound Controls - Minimalist */}
        <div className="flex gap-4">
          <button 
            onClick={() => setSoundType(prev => prev === 'rain' ? 'fire' : 'rain')}
            className="p-3 text-white/40 hover:text-white/80 hover:bg-white/5 rounded-full transition-all"
            title="Switch Background Sound"
          >
            <span className="text-xl filter drop-shadow-md">{soundType === 'rain' ? '🌧️' : '🔥'}</span>
          </button>
          <button 
            onClick={() => setIsMuted(prev => !prev)}
            className={`p-3 transition-all rounded-full ${isMuted ? 'text-white/20' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
            title="Toggle Sound"
          >
            <span className="text-xl filter drop-shadow-md">{isMuted ? '🔇' : '🔊'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
