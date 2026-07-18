import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './App.css';
import { useScene } from './hooks/useScene';
import Stars from './components/Stars';
import Cake from './components/Cake';
import Meteor from './components/Meteor';

function App() {
  const { scene, startScene } = useScene();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [volume] = useState(0.8);
  const audioSrc = `${import.meta.env.BASE_URL}happy-birthday.mp3`;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const startExperience = async () => {
    if (hasStarted) return;

    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.volume = volume;
      audio.currentTime = 0;
      await audio.play();
      setIsPlaying(true);
      setTimeout(() => {
        startScene();
      }, 150);
      setHasStarted(true);
    } catch {
      setIsPlaying(false);
      setHasStarted(true);
    }
  };

  const stopExperience = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setIsPlaying(false);
  };

  return (
    <div
      className="app-container"
      style={{ background: '#050505', width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}
      onClick={startExperience}
      onTouchStart={startExperience}
    >
      <audio ref={audioRef} src={audioSrc} preload="auto" loop />

      {!hasStarted && (
        <div className="start-hint">
          <div className="start-hint-card">誕生日おめでとうございます❣</div>
        </div>
      )}

      <div className="music-panel">
        <div className="music-status">{isPlaying ? '🎵 正在播放' : '🎵 已暂停'}</div>
        <button className="stop-button" onClick={(event) => {
          event.stopPropagation();
          if (isPlaying) {
            stopExperience();
          } else {
            void startExperience();
          }
        }}>
          {isPlaying ? '停止' : '继续'}
        </button>
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