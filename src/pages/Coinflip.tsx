import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { WalletModal } from "@/components/WalletModal";
import { useCoinflipRooms } from "@/hooks/useCoinflipRooms";
import { useCoinflipHistory } from "@/hooks/useCoinflipHistory";
import gokuCoin from "@/assets/goku-coin.png";
import vegetaCoin from "@/assets/vegeta-coin.png";

type CoinSide = 'heads' | 'tails';

export default function Coinflip() {
  const [selectedSide, setSelectedSide] = useState<CoinSide | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<CoinSide | null>(null);
  const [betAmount, setBetAmount] = useState("0.1");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [mode, setMode] = useState<'solo' | 'multiplayer'>('solo');

  const { rooms, loading: roomsLoading, createRoom, joinRoom } = useCoinflipRooms(walletAddress);
  const { history, loading: historyLoading } = useCoinflipHistory(walletAddress);

  const handleConnect = (address: string) => {
    setWalletAddress(address);
    toast.success("Carteira conectada!");
  };

  const handleFlip = (side: CoinSide) => {
    if (isFlipping) return;
    
    if (!walletAddress) {
      setShowWalletModal(true);
      return;
    }

    setSelectedSide(side);
    setIsFlipping(true);
    setResult(null);
    
    toast.loading("Girando a moeda...", { id: "flipping" });
    
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

  const handleCreateRoom = async () => {
    if (!walletAddress) {
      setShowWalletModal(true);
      return;
    }

    if (!selectedSide) {
      toast.error("Escolha um lado primeiro!");
      return;
    }

    await createRoom(parseFloat(betAmount), selectedSide);
  };

  const handleJoinRoom = async (roomId: string) => {
    if (!walletAddress) {
      setShowWalletModal(true);
      return;
    }

    toast.loading("Entrando na sala...", { id: "joining" });
    const success = await joinRoom(roomId);
    toast.dismiss("joining");
    
    if (success) {
      toast.success("Partida iniciada!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1625] via-[#2d1b3d] to-[#1a1625]">
      <Header />
      
      <WalletModal 
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleConnect}
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-yellow-400 mb-4 drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]" style={{ textShadow: '2px 2px 0 #ff6600, 4px 4px 0 #ff4400' }}>
              COINFLIP DRAGON BALL
            </h1>
            <p className="text-3xl font-bold text-yellow-300">HEADS vs TAILS</p>
            
            {!walletAddress && (
              <Button 
                onClick={() => setShowWalletModal(true)}
                className="mt-4 bg-yellow-400 text-orange-900 hover:bg-yellow-500 font-bold text-lg px-8"
              >
                Conectar Carteira
              </Button>
            )}
            
            {walletAddress && (
              <div className="mt-4 text-yellow-300">
                <p className="text-sm">Carteira: {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</p>
              </div>
            )}
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as 'solo' | 'multiplayer')} className="mb-8">
            <TabsList className="grid w-full grid-cols-2 bg-purple-900/50">
              <TabsTrigger value="solo" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-orange-900">
                Solo
              </TabsTrigger>
              <TabsTrigger value="multiplayer" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-orange-900">
                Multiplayer 1v1
              </TabsTrigger>
            </TabsList>

            <TabsContent value="solo" className="mt-8">

            <Card className="bg-gradient-to-br from-purple-900/90 to-purple-800/90 border-4 border-yellow-400 shadow-2xl p-8 backdrop-blur-sm">
              {/* Bet Amount Input */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-yellow-200 mb-4">Valor da Aposta (SOL)</h2>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  disabled={isFlipping}
                  className="w-48 px-4 py-3 text-2xl font-bold text-center bg-yellow-400 border-4 border-purple-600 rounded-xl text-purple-900 focus:outline-none focus:ring-4 focus:ring-yellow-300"
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

                <div className="text-5xl font-bold text-yellow-300 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]" style={{ textShadow: '3px 3px 0 #ff6600' }}>
                  VS
                </div>

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
                  <div className="bg-yellow-400 border-4 border-purple-600 rounded-xl p-6 inline-block shadow-2xl">
                    <p className="text-3xl font-bold text-purple-900 mb-2">
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
            </TabsContent>

            <TabsContent value="multiplayer" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Criar Sala */}
                <Card className="bg-gradient-to-br from-purple-900/90 to-purple-800/90 border-4 border-yellow-400 shadow-2xl p-6">
                  <h2 className="text-2xl font-bold text-yellow-300 mb-4">Criar Sala 1v1</h2>
                  
                  <div className="mb-4">
                    <label className="text-yellow-200 block mb-2">Valor da Aposta (SOL)</label>
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      className="w-full px-4 py-2 bg-purple-800 text-yellow-200 border-2 border-yellow-400 rounded-lg"
                      step="0.1"
                      min="0.1"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-yellow-200 block mb-2">Escolha seu lado</label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setSelectedSide('heads')}
                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                          selectedSide === 'heads'
                            ? 'border-blue-400 bg-blue-900/50'
                            : 'border-yellow-400 hover:border-blue-400'
                        }`}
                      >
                        <img src={gokuCoin} alt="Heads" className="w-16 h-16 mx-auto mb-2" />
                        <span className="text-yellow-200 font-bold">HEADS</span>
                      </button>
                      <button
                        onClick={() => setSelectedSide('tails')}
                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                          selectedSide === 'tails'
                            ? 'border-purple-400 bg-purple-900/50'
                            : 'border-yellow-400 hover:border-purple-400'
                        }`}
                      >
                        <img src={vegetaCoin} alt="Tails" className="w-16 h-16 mx-auto mb-2" />
                        <span className="text-yellow-200 font-bold">TAILS</span>
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateRoom}
                    disabled={!selectedSide}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold text-lg"
                  >
                    Criar Sala
                  </Button>
                </Card>

                {/* Salas Disponíveis */}
                <Card className="bg-gradient-to-br from-purple-900/90 to-purple-800/90 border-4 border-yellow-400 shadow-2xl p-6">
                  <h2 className="text-2xl font-bold text-yellow-300 mb-4">Salas Disponíveis</h2>
                  
                  {roomsLoading ? (
                    <p className="text-yellow-200">Carregando salas...</p>
                  ) : rooms.length === 0 ? (
                    <p className="text-yellow-200">Nenhuma sala disponível. Crie uma!</p>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {rooms.map((room) => (
                        <div
                          key={room.id}
                          className="bg-purple-800/50 border-2 border-yellow-400 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-yellow-300 font-bold">
                              {room.bet_amount} SOL
                            </span>
                            <span className="text-yellow-200 text-sm">
                              {room.creator_side === 'heads' ? '🔵 vs 🟣' : '🟣 vs 🔵'}
                            </span>
                          </div>
                          <div className="text-yellow-200 text-xs mb-2">
                            Criador: {room.creator_wallet.slice(0, 4)}...{room.creator_wallet.slice(-4)}
                          </div>
                          <Button
                            onClick={() => handleJoinRoom(room.id)}
                            disabled={room.creator_wallet === walletAddress}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold"
                          >
                            {room.creator_wallet === walletAddress ? 'Sua Sala' : 'Entrar'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Histórico */}
          {walletAddress && (
            <Card className="bg-gradient-to-br from-purple-900/90 to-purple-800/90 border-4 border-yellow-400 shadow-2xl p-6 mt-8">
              <h2 className="text-2xl font-bold text-yellow-300 mb-4">Histórico de Partidas</h2>
              
              {historyLoading ? (
                <p className="text-yellow-200">Carregando histórico...</p>
              ) : history.length === 0 ? (
                <p className="text-yellow-200">Nenhuma partida jogada ainda.</p>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-lg border-2 ${
                        item.won
                          ? 'bg-green-900/20 border-green-400'
                          : 'bg-red-900/20 border-red-400'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-yellow-200 font-bold">
                            {item.bet_amount} SOL - {item.chosen_side === 'heads' ? 'HEADS' : 'TAILS'}
                          </span>
                          <span className="text-yellow-300 text-sm ml-2">
                            Resultado: {item.result === 'heads' ? 'HEADS' : 'TAILS'}
                          </span>
                        </div>
                        <div className={`font-bold ${item.won ? 'text-green-400' : 'text-red-400'}`}>
                          {item.won ? `+${item.payout} SOL` : `-${item.bet_amount} SOL`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          <div className="mt-8 text-center">
            <Card className="bg-purple-900/80 border-2 border-yellow-400 p-4 backdrop-blur-sm">
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
