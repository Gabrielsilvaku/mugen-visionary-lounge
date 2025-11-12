import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import gokuCoin from "@/assets/goku-coin.png";
import vegetaCoin from "@/assets/vegeta-coin.png";

export default function CoinflipDB() {
  const [selectedSide, setSelectedSide] = useState<'goku' | 'vegeta' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'goku' | 'vegeta' | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);

  const handleFlip = (side: 'goku' | 'vegeta') => {
    if (isFlipping || isWaiting) return;
    
    setSelectedSide(side);
    setIsFlipping(true);
    setResult(null);
    setIsWaiting(true);
    
    toast.loading("Aguardando oponente...", { id: "waiting" });
    
    // Simula espera por oponente (3 segundos)
    setTimeout(() => {
      toast.dismiss("waiting");
      toast.loading("Girando moeda...", { id: "flipping" });
      
      // Simula o giro da moeda (3 segundos)
      setTimeout(() => {
        const flipResult = Math.random() > 0.5 ? 'goku' : 'vegeta';
        setResult(flipResult);
        setIsFlipping(false);
        setIsWaiting(false);
        
        toast.dismiss("flipping");
        
        if (flipResult === side) {
          toast.success("🎉 Você ganhou! " + (side === 'goku' ? 'Goku' : 'Vegeta') + " venceu!", {
            duration: 4000,
          });
        } else {
          toast.error("😔 Você perdeu! " + (flipResult === 'goku' ? 'Goku' : 'Vegeta') + " venceu!", {
            duration: 4000,
          });
        }
      }, 3000);
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
            <p className="text-3xl font-bold text-orange-900">1 VS 1</p>
          </div>

          <Card className="bg-gradient-to-br from-orange-600/90 to-red-600/90 border-4 border-yellow-400 shadow-2xl p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-yellow-200 mb-2">Escolha seu guerreiro!</h2>
              {isWaiting && <p className="text-yellow-300 animate-pulse">Aguardando oponente...</p>}
            </div>

            <div className="flex justify-center items-center gap-12 mb-8">
              {/* Goku Button */}
              <div className="relative">
                <button
                  onClick={() => handleFlip('goku')}
                  disabled={isFlipping || isWaiting}
                  className={`relative group ${isFlipping || isWaiting ? 'cursor-not-allowed' : ''}`}
                >
                  <div className={`w-48 h-48 rounded-full overflow-hidden border-8 transition-all duration-300 ${
                    selectedSide === 'goku' 
                      ? 'border-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.9)]' 
                      : 'border-orange-300 group-hover:border-blue-400 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]'
                  } ${isFlipping ? 'animate-[spin_0.5s_linear_infinite]' : ''}`}>
                    <img 
                      src={gokuCoin} 
                      alt="Goku"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform"
                    />
                  </div>
                  {!isFlipping && !isWaiting && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="text-2xl font-bold text-orange-900 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">GOKU</span>
                    </div>
                  )}
                </button>
              </div>

              {/* VS Text */}
              <div className="text-6xl font-bold text-yellow-300 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]" style={{ textShadow: '3px 3px 0 #ff6600' }}>
                VS
              </div>

              {/* Vegeta Button */}
              <div className="relative">
                <button
                  onClick={() => handleFlip('vegeta')}
                  disabled={isFlipping || isWaiting}
                  className={`relative group ${isFlipping || isWaiting ? 'cursor-not-allowed' : ''}`}
                >
                  <div className={`w-48 h-48 rounded-full overflow-hidden border-8 transition-all duration-300 ${
                    selectedSide === 'vegeta' 
                      ? 'border-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.9)]' 
                      : 'border-orange-300 group-hover:border-purple-400 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]'
                  } ${isFlipping ? 'animate-[spin_0.5s_linear_infinite]' : ''}`}>
                    <img 
                      src={vegetaCoin} 
                      alt="Vegeta"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform"
                    />
                  </div>
                  {!isFlipping && !isWaiting && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="text-2xl font-bold text-orange-900 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">VEGETA</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {result && !isFlipping && (
              <div className="mt-12 text-center animate-fade-in">
                <div className="bg-yellow-400 border-4 border-orange-600 rounded-xl p-6 inline-block shadow-2xl">
                  <p className="text-3xl font-bold text-orange-900 mb-2">
                    🏆 VENCEDOR 🏆
                  </p>
                  <p className="text-5xl font-bold text-red-600">
                    {result === 'goku' ? 'GOKU' : 'VEGETA'}
                  </p>
                </div>
              </div>
            )}

            {!result && !isFlipping && !isWaiting && (
              <div className="text-center mt-8">
                <p className="text-yellow-200 text-lg">
                  Clique em um guerreiro para começar a batalha!
                </p>
              </div>
            )}
          </Card>

          <div className="mt-8 text-center">
            <Card className="bg-orange-600/80 border-2 border-yellow-400 p-4 backdrop-blur-sm">
              <p className="text-yellow-100 font-semibold">
                💰 Aposte e teste sua sorte contra outro jogador!
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
