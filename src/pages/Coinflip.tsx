import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import gokuCoin from "@/assets/goku-coin.png";
import vegetaCoin from "@/assets/vegeta-coin.png";

type CoinSide = 'heads' | 'tails';

export default function Coinflip() {
  const [selectedSide, setSelectedSide] = useState<CoinSide | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<CoinSide | null>(null);
  const [betAmount, setBetAmount] = useState("0.1");

  const handleFlip = (side: CoinSide) => {
    if (isFlipping) return;
    
    setSelectedSide(side);
    setIsFlipping(true);
    setResult(null);
    
    toast.loading("Girando a moeda...", { id: "flipping" });
    
    // Simula o giro da moeda (3 segundos)
    setTimeout(() => {
      const flipResult: CoinSide = Math.random() > 0.5 ? 'heads' : 'tails';
      setResult(flipResult);
      setIsFlipping(false);
      
      toast.dismiss("flipping");
      
      if (flipResult === side) {
        toast.success(`🎉 Você ganhou! ${flipResult === 'heads' ? 'HEADS (Goku)' : 'TAILS (Vegeta)'} venceu!`, {
          duration: 4000,
        });
      } else {
        toast.error(`😔 Você perdeu! ${flipResult === 'heads' ? 'HEADS (Goku)' : 'TAILS (Vegeta)'} venceu!`, {
          duration: 4000,
        });
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-400 via-yellow-300 to-orange-500">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-[0_0_20px_rgba(255,165,0,0.8)]" style={{ textShadow: '2px 2px 0 #ff6600, 4px 4px 0 #ff4400' }}>
              COINFLIP DRAGON BALL
            </h1>
            <p className="text-3xl font-bold text-orange-900">HEADS vs TAILS</p>
          </div>

          <Card className="bg-gradient-to-br from-orange-600/90 to-red-600/90 border-4 border-yellow-400 shadow-2xl p-8 backdrop-blur-sm">
            {/* Bet Amount Input */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-4">Valor da Aposta (SOL)</h2>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                disabled={isFlipping}
                className="w-48 px-4 py-3 text-2xl font-bold text-center bg-yellow-400 border-4 border-orange-600 rounded-xl text-orange-900 focus:outline-none focus:ring-4 focus:ring-yellow-300"
                step="0.1"
                min="0.1"
              />
            </div>

            {/* Coin Display */}
            <div className="flex justify-center mb-8">
              <div className="relative w-64 h-64">
                <div 
                  className={`w-full h-full transition-all duration-500 ${
                    isFlipping ? 'animate-[spin_0.3s_linear_infinite]' : ''
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: !isFlipping && result 
                      ? result === 'heads' ? 'rotateY(0deg)' : 'rotateY(180deg)' 
                      : 'rotateY(0deg)'
                  }}
                >
                  <img 
                    src={result === 'tails' ? vegetaCoin : gokuCoin}
                    alt={result === 'tails' ? 'Vegeta' : 'Goku'}
                    className="w-full h-full object-cover rounded-full border-8 border-yellow-400 shadow-[0_0_40px_rgba(255,215,0,0.8)]"
                  />
                </div>
              </div>
            </div>

            {/* Betting Buttons */}
            <div className="flex justify-center items-center gap-8 mb-8">
              {/* Heads (Goku) Button */}
              <button
                onClick={() => handleFlip('heads')}
                disabled={isFlipping}
                className={`group relative ${isFlipping ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <div className={`w-40 h-40 rounded-full overflow-hidden border-8 transition-all duration-300 ${
                  selectedSide === 'heads' 
                    ? 'border-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.9)] scale-110' 
                    : 'border-yellow-300 group-hover:border-blue-400 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]'
                }`}>
                  <img 
                    src={gokuCoin} 
                    alt="Heads - Goku"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-2xl font-bold text-yellow-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    HEADS
                  </span>
                </div>
              </button>

              {/* VS Text */}
              <div className="text-5xl font-bold text-yellow-300 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]" style={{ textShadow: '3px 3px 0 #ff6600' }}>
                VS
              </div>

              {/* Tails (Vegeta) Button */}
              <button
                onClick={() => handleFlip('tails')}
                disabled={isFlipping}
                className={`group relative ${isFlipping ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <div className={`w-40 h-40 rounded-full overflow-hidden border-8 transition-all duration-300 ${
                  selectedSide === 'tails' 
                    ? 'border-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.9)] scale-110' 
                    : 'border-yellow-300 group-hover:border-purple-400 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]'
                }`}>
                  <img 
                    src={vegetaCoin} 
                    alt="Tails - Vegeta"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-2xl font-bold text-yellow-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    TAILS
                  </span>
                </div>
              </button>
            </div>

            {/* Result Display */}
            {result && !isFlipping && (
              <div className="mt-12 text-center animate-fade-in">
                <div className="bg-yellow-400 border-4 border-orange-600 rounded-xl p-6 inline-block shadow-2xl">
                  <p className="text-3xl font-bold text-orange-900 mb-2">
                    🏆 RESULTADO 🏆
                  </p>
                  <p className="text-5xl font-bold text-red-600">
                    {result === 'heads' ? 'HEADS (Goku)' : 'TAILS (Vegeta)'}
                  </p>
                  {selectedSide === result && (
                    <p className="text-2xl font-bold text-green-600 mt-2">
                      +{parseFloat(betAmount) * 2} SOL
                    </p>
                  )}
                </div>
              </div>
            )}

            {!result && !isFlipping && (
              <div className="text-center mt-8">
                <p className="text-yellow-200 text-lg">
                  Escolha HEADS (Goku) ou TAILS (Vegeta) para começar!
                </p>
              </div>
            )}
          </Card>

          <div className="mt-8 text-center">
            <Card className="bg-orange-600/80 border-2 border-yellow-400 p-4 backdrop-blur-sm">
              <p className="text-yellow-100 font-semibold text-lg">
                💰 Escolha seu lado e teste sua sorte! Ganhe 2x o valor apostado!
              </p>
              <p className="text-yellow-200 text-sm mt-2">
                HEADS = Goku 🔵 | TAILS = Vegeta 🟣
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
