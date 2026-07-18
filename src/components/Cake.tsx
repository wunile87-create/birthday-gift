import '../styles/Cake.css';

interface CakeProps {
  scene: number;
}

function Cake({ scene }: CakeProps) {
  if (scene < 3) return null;

  return (
    <div className={`cake-reveal-container ${scene >= 4 ? 'lit-up' : ''}`}>
      <div className="candle-glow-aura" style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.25) 0%, transparent 70%)' }}></div>

      <div className="cake">
        <div className="candles">
          {[0, 1, 2].map((index) => {
            const isLit = scene >= 4;
            return (
              <div key={index} className={`candle ${isLit ? 'lit' : ''}`}>
                {isLit ? <div className="flame"></div> : null}
              </div>
            );
          })}
        </div>

        <div className="cake-layers">
          <div className="cream-top"></div>
          <div className="cake-body">
            <div className="cream-middle"></div>
          </div>
          <div className="cake-board"></div>
        </div>
      </div>
    </div>
  );
}

export default Cake;