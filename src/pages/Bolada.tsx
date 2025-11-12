import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Users, Trophy, Coins } from "lucide-react";

const dbCharacters = [
  { name: "Goku", color: "bg-orange-500", borderColor: "border-orange-400" },
  { name: "Vegeta", color: "bg-blue-500", borderColor: "border-blue-400" },
  { name: "Gohan", color: "bg-purple-500", borderColor: "border-purple-400" },
  { name: "Piccolo", color: "bg-green-500", borderColor: "border-green-400" },
  { name: "Trunks", color: "bg-indigo-500", borderColor: "border-indigo-400" },
  { name: "Krillin", color: "bg-yellow-500", borderColor: "border-yellow-400" },
];

export default function JackpotDB() {
  const [players, setPlayers] = useState<Array<{id: string, character: string, bet: number}>>([]);
  const [winner, setWinner] = useState<{id: string, character: string, bet: number} | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [totalPot, setTotalPot] = useState(0);

  const handleJoin = () => {
    if (players.length >= 6) {
      toast.error("Sala cheia! Máximo 6 jogadores");
      return;
    }

    const randomCharacter = dbCharacters[Math.floor(Math.random() * dbCharacters.length)].name;
    const randomBet = Math.floor(Math.random() * 10 + 1);
    const newPlayer = {
      id: `Player ${players.length + 1}`,
      character: randomCharacter,
      bet: randomBet
    };

    setPlayers([...players, newPlayer]);
    setTotalPot(totalPot + randomBet);
    toast.success(`${newPlayer.id} entrou como ${randomCharacter}! 🐉`, {
      description: `Aposta: ${randomBet} SOL`
    });
  };

  const handleDraw = () => {
    if (players.length < 2) {
      toast.error("Precisa de pelo menos 2 jogadores!");
      return;
    }

    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);
    toast.loading("Girando a roleta...", { id: "spinning" });

    // Simula o giro da roleta
    setTimeout(() => {
      const randomWinner = players[Math.floor(Math.random() * players.length)];
      setWinner(randomWinner);
      setIsSpinning(false);
      toast.dismiss("spinning");
      
      toast.success(`🏆 ${randomWinner.id} VENCEU!`, {
        description: `${randomWinner.character} levou ${totalPot} SOL!`,
        duration: 5000,
      });
    }, 5000);
  };

  const handleReset = () => {
    setPlayers([]);
    setWinner(null);
    setTotalPot(0);
    toast.info("Jogo resetado!");
  };

  const getCharacterColor = (characterName: string) => {
    return dbCharacters.find(c => c.name === characterName) || dbCharacters[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-7xl font-bold text-white mb-4 drop-shadow-[0_0_30px_rgba(255,100,0,0.9)]" style={{ textShadow: '3px 3px 0 #cc0000, 6px 6px 0 #990000' }}>
              JACKPOT DRAGON BALL
            </h1>
            <p className="text-3xl font-bold text-yellow-300">A ROLETA DOS GUERREIROS Z</p>
          </div>

          {/* Pot Total */}
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-400 border-4 border-red-600 p-6 mb-8 shadow-2xl">
            <div className="flex items-center justify-center gap-4">
              <Trophy className="w-12 h-12 text-red-700" />
              <div className="text-center">
                <p className="text-xl font-bold text-red-800">PRÊMIO TOTAL</p>
                <p className="text-5xl font-bold text-red-900">{totalPot} SOL</p>
              </div>
              <Trophy className="w-12 h-12 text-red-700" />
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Roleta */}
            <Card className="bg-gradient-to-br from-red-700/90 to-orange-700/90 border-4 border-yellow-400 p-8 shadow-2xl backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-yellow-300 text-center mb-6">ROLETA</h2>
              
              <div className="relative flex items-center justify-center mb-8">
                <div className={`w-64 h-64 rounded-full border-8 border-yellow-400 bg-gradient-to-br from-orange-600 to-red-700 shadow-2xl flex items-center justify-center relative overflow-hidden ${
                  isSpinning ? 'animate-[spin_1s_linear_infinite]' : ''
                }`}>
                  {/* Segmentos da roleta */}
                  {players.map((player, index) => {
                    const char = getCharacterColor(player.character);
                    const rotation = (360 / players.length) * index;
                    return (
                      <div
                        key={index}
                        className={`absolute w-full h-full ${char.color} opacity-70`}
                        style={{
                          clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((rotation - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((rotation - 90) * Math.PI / 180)}%)`,
                          transform: `rotate(${rotation}deg)`,
                        }}
                      />
                    );
                  })}
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-yellow-400 rounded-full w-20 h-20 border-4 border-red-600 flex items-center justify-center z-10">
                      <span className="text-3xl">🐉</span>
                    </div>
                  </div>
                </div>

                {/* Indicador */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
                  <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-yellow-400 drop-shadow-lg" />
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleJoin}
                  disabled={isSpinning || players.length >= 6}
                  className="bg-yellow-400 hover:bg-yellow-500 text-red-900 font-bold text-lg px-8 py-6 border-2 border-red-600 shadow-lg"
                >
                  <Users className="w-5 h-5 mr-2" />
                  ENTRAR ({players.length}/6)
                </Button>
                <Button
                  onClick={handleDraw}
                  disabled={isSpinning || players.length < 2}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-6 border-2 border-yellow-400 shadow-lg"
                >
                  <Coins className="w-5 h-5 mr-2" />
                  GIRAR
                </Button>
              </div>
            </Card>

            {/* Jogadores e Resultado */}
            <div className="space-y-6">
              {/* Jogadores */}
              <Card className="bg-gradient-to-br from-orange-700/90 to-red-700/90 border-4 border-yellow-400 p-6 shadow-2xl backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  GUERREIROS NA ARENA
                </h2>
                
                {players.length === 0 ? (
                  <p className="text-yellow-200 text-center py-8">
                    Nenhum guerreiro na arena ainda...
                  </p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {players.map((player, index) => {
                      const char = getCharacterColor(player.character);
                      return (
                        <div
                          key={index}
                          className={`${char.color} border-2 ${char.borderColor} rounded-lg p-4 flex justify-between items-center shadow-lg`}
                        >
                          <div>
                            <p className="font-bold text-white text-lg">{player.id}</p>
                            <p className="text-sm text-white/90">{player.character}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-white">{player.bet} SOL</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>

              {/* Vencedor */}
              {winner && (
                <Card className="bg-gradient-to-br from-yellow-400 to-yellow-300 border-4 border-red-600 p-8 shadow-2xl animate-fade-in">
                  <div className="text-center">
                    <Trophy className="w-16 h-16 text-red-700 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-red-800 mb-2">🏆 VENCEDOR 🏆</h2>
                    <p className="text-4xl font-bold text-red-900 mb-2">{winner.id}</p>
                    <p className="text-2xl font-bold text-orange-800">{winner.character}</p>
                    <p className="text-3xl font-bold text-red-800 mt-4">
                      Ganhou {totalPot} SOL! 💰
                    </p>
                    <Button
                      onClick={handleReset}
                      className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold"
                    >
                      Nova Rodada
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Info */}
          <Card className="mt-8 bg-orange-600/80 border-2 border-yellow-400 p-4 backdrop-blur-sm">
            <p className="text-yellow-100 text-center font-semibold">
              🐉 Entre na arena, escolha seu guerreiro e teste sua sorte! O vencedor leva tudo! 🐉
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
