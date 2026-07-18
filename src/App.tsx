import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './App.css';
import { useScene } from './hooks/useScene';
import Stars from './components/Stars';
import Cake from './components/Cake';
import Meteor from './components/Meteor';

function App() {
  const { scene } = useScene();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [volume] = useState(0.35);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (hasStarted) return;

    const startAudio = async () => {
      if (!audioRef.current) return;
      try {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };

    void startAudio();
  }, [hasStarted]);

  const handleStartExperience = async () => {
    if (!audioRef.current) return;

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setHasStarted(true);
    } catch {
      setIsPlaying(false);
      setHasStarted(true);
    }
  };

  return (
    <div className="app-container" style={{ background: '#050505', width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <audio ref={audioRef} src="/happy-birthday.mp3" preload="auto" loop />

      {!hasStarted && (
        <div className="start-overlay" onClick={handleStartExperience}>
          <div className="start-card">🎊 生日快乐！</div>
        </div>
      )}

      <div className="music-panel">
        <div className="music-status">{isPlaying ? '🎵 生日快乐正在演奏' : '🎵 生日快乐即将开始'}</div>
      </div>

      <Stars scene={scene} />
      {scene >= 2 ? <Meteor /> : null}
      <Cake scene={scene} />

      {scene >= 5 ? (
        <div className="fireworks-layer">
          {Array.from({ length: 24 }).map((_, index) => (
            <span
              key={index}
              className="firework-piece"
              style={{
                '--delay': `${index * 0.06}s`,
                '--x': `${(index % 6 - 3) * 70}px`,
                '--y': `${Math.floor(index / 6) * 70 - 140}px`,
              } as CSSProperties}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default App;