import { useState, useEffect } from "react";

interface Roulette3DProps {
  isSpinning: boolean;
  players: Array<{id: string, character: string, bet: number}>;
  winnerIndex?: number;
}

const dbCharacters = [
  { name: "Goku", color: "from-orange-500 to-red-500" },
  { name: "Vegeta", color: "from-blue-500 to-indigo-600" },
  { name: "Gohan", color: "from-purple-500 to-pink-600" },
  { name: "Piccolo", color: "from-green-500 to-emerald-600" },
  { name: "Trunks", color: "from-indigo-500 to-blue-600" },
  { name: "Krillin", color: "from-yellow-500 to-orange-500" },
];

export const Roulette3D = ({ isSpinning, players, winnerIndex }: Roulette3DProps) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isSpinning && players.length > 0) {
      const spins = 5;
      const targetIndex = winnerIndex ?? 0;
      const segmentAngle = 360 / players.length;
      const finalRotation = (spins * 360) + (targetIndex * segmentAngle);
      
      setRotation(finalRotation);
    }
  }, [isSpinning, winnerIndex, players.length]);

  if (players.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="w-64 h-64 rounded-full border-8 border-dashed border-primary/30 flex items-center justify-center">
            <p className="text-foreground text-xl">Aguardando jogadores...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 flex items-center justify-center perspective-1000">
      <div className="absolute top-0 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-primary z-20"></div>
      
      <div 
        className="relative w-80 h-80 rounded-full transition-transform duration-[5000ms] ease-out"
        style={{
          transform: `rotate(${rotation}deg)`,
          transformStyle: "preserve-3d"
        }}
      >
        {players.map((player, index) => {
          const angle = (360 / players.length) * index;
          const character = dbCharacters.find(c => c.name === player.character) || dbCharacters[0];
          
          return (
            <div
              key={index}
              className="absolute w-full h-full"
              style={{
                transform: `rotate(${angle}deg)`,
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((360/players.length) * Math.PI / 180)}% ${50 - 50 * Math.cos((360/players.length) * Math.PI / 180)}%)`
              }}
            >
              <div className={`w-full h-full bg-gradient-to-br ${character.color} border-2 border-white/20 flex items-start justify-center pt-8`}>
                <div className="text-center">
                  <p className="text-white font-bold text-sm">{player.character}</p>
                  <p className="text-white/80 text-xs">{player.bet} SOL</p>
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="absolute inset-0 rounded-full border-8 border-primary pointer-events-none"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-background border-4 border-primary flex items-center justify-center z-10">
            <span className="text-primary font-bold text-xs">SPIN</span>
          </div>
        </div>
      </div>
    </div>
  );
};
