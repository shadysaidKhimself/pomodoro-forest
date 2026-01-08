import React, { useState, useEffect } from 'react';
import { triggerFireworks } from '../utils/Confetti';
import ImmersiveBackground from './ImmersiveBackground';
import ForestSidebar, { ForestHistoryItem } from './ForestSidebar';
import TimerDisplay, { TimerStatus, SoundType } from './TimerDisplay';

const FOCUS_TIME = 25 * 60; // 25 minutes in seconds

export default function TimerForest() {
  const [timeLeft, setTimeLeft] = useState<number>(FOCUS_TIME);
  const [status, setStatus] = useState<TimerStatus>('IDLE'); 
  const [soundType, setSoundType] = useState<SoundType>('rain'); // 'rain' | 'fire'
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  /* 
    State for My Forest History 
    Each item: { id, date, tree, top, left }
  */
  const [forestHistory, setForestHistory] = useState<ForestHistoryItem[]>(() => {
    const saved = localStorage.getItem('pomodoro_forest_history');
    return saved ? JSON.parse(saved) : [];
  });

  const audioRef = React.useRef<HTMLAudioElement>(new Audio());
  
  // Save to LocalStorage whenever history changes
  useEffect(() => {
    localStorage.setItem('pomodoro_forest_history', JSON.stringify(forestHistory));
  }, [forestHistory]);


  // Audio URLs from public folder
  const SOUNDS: Record<SoundType, string> = {
    rain: `${import.meta.env.BASE_URL}rain.mp3`,
    fire: `${import.meta.env.BASE_URL}fireplace.mp3`
  };

  // Handle Audio Playback
  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;

    // Change source if needed
    const targetSrc = new URL(SOUNDS[soundType], window.location.href).href;
    if (audio.src !== targetSrc) {
      const wasPlaying = !audio.paused;
      audio.src = targetSrc;
      if (wasPlaying) audio.play().catch(e => console.log('Audio play failed:', e));
    }

    // Play/Pause based on status
    if (status === 'RUNNING' && !isMuted) {
      audio.play().catch(e => console.log('Audio play failed:', e));
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
    };
  }, [status, soundType, isMuted]);

  // Handle Timer Tick
  useEffect(() => {
    let interval: number | null = null;
    if (status === 'RUNNING' && timeLeft > 0) {
      // Calculate the absolute end time based on the current moment
      const endTime = Date.now() + timeLeft * 1000;

      interval = window.setInterval(() => {
        const now = Date.now();
        const diff = Math.ceil((endTime - now) / 1000);

        if (diff <= 0) {
          setTimeLeft(0);
          setStatus('COMPLETED');
          triggerFireworks();
          
          // Improved position randomness (covering 5% to 95% range)
          const randomTop = (5 + Math.random() * 90).toFixed(2);
          const randomLeft = (5 + Math.random() * 90).toFixed(2);
          
          // Final visual style: fixed tree icon, no rotation, slight scale variety
          const randomScale = 0.9 + Math.random() * 0.3; // 0.9 to 1.2 scale
          
          // Add to history with enhanced random position
          setForestHistory(prev => [
            { 
              id: Date.now(), 
              date: new Date().toISOString(), 
              tree: '🌲', 
              rotation: 0,
              scale: randomScale,
              top: `${randomTop}%`,
              left: `${randomLeft}%`
            },
            ...prev
          ]);
          
          if (interval) clearInterval(interval);
        } else {
          setTimeLeft(diff);
        }
      }, 200); 
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]); 

  const handleStart = () => {
    setStatus('RUNNING');
    // Mobile browsers require audio playback to be initiated by a user gesture
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        /* Silence errors if it fails here, the useEffect will handle it after unlock */
      });
    }
  };
  const handlePause = () => setStatus('PAUSED');
  const handleReset = () => {
    setStatus('IDLE');
    setTimeLeft(FOCUS_TIME);
  };
  const handleGiveUp = () => setStatus('FAILED');

  // Format time mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Tree Stage Logic
  const getTreeEmoji = () => {
    if (status === 'IDLE') return null;
    if (status === 'FAILED') return '🥀';
    if (status === 'COMPLETED') return '🌲'; // Full tree on complete

    const elapsed = FOCUS_TIME - timeLeft;
    if (elapsed < 8 * 60) return '🌱';
    if (elapsed < 16 * 60) return '🌿';
    if (elapsed < 25 * 60) return '🌳';
    return '🌲';
  };

  const treeEmoji = getTreeEmoji();

  return (
    <>
      <ImmersiveBackground status={status} />
      
      <ForestSidebar forestHistory={forestHistory} />
      
      <TimerDisplay 
        status={status}
        treeEmoji={treeEmoji}
        formattedTime={formattedTime}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onGiveUp={handleGiveUp}
        soundType={soundType}
        setSoundType={setSoundType}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />
    </>
  );
}
