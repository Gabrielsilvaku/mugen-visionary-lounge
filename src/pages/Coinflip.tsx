import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import coinGoku from "@/assets/goku.png";
import coinVegeta from "@/assets/vegeta.png";

const socket = io("http://localhost:3001");

export default function CoinflipDB() {
  const [selectedSide, setSelectedSide] = useState(null);
  const [result, setResult] = useState(null);
  const [opponentSide, setOpponentSide] = useState(null);
  const [gameId, setGameId] = useState(null);

  useEffect(() => {
    socket.emit("joinCoinflip");

    socket.on("coinflipUpdate", (game) => {
      setGameId(game.id);
      setResult(game.result);
      const opponent = game.players.find(p => p !== socket.id);
      setOpponentSide(opponent ? game.bets[opponent] : null);

      if (game.result && selectedSide) {
        if (game.result === selectedSide) toast.success("🎉 Você ganhou!");
        else toast.error("😔 Você perdeu");
      }
    });
  }, [selectedSide]);

  const handleFlip = (side) => {
    setSelectedSide(side);
    socket.emit("flipCoin", side);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-200 via-orange-200 to-red-200 flex flex-col items-center justify-start py-12">
      <h1 className="text-4xl font-bold mb-6">Coinflip Dragon Ball 1v1</h1>
      <div className="flex gap-6 mb-6">
        <button onClick={() => handleFlip("heads")} className="w-32 h-32 rounded-full shadow-lg hover:scale-105 transition-transform">
          <img src={coinGoku} alt="Goku" className="w-full h-full object-cover rounded-full" />
        </button>
        <button onClick={() => handleFlip("tails")} className="w-32 h-32 rounded-full shadow-lg hover:scale-105 transition-transform">
          <img src={coinVegeta} alt="Vegeta" className="w-full h-full object-cover rounded-full" />
        </button>
      </div>

      {result && (
        <div className="text-center text-2xl font-bold mb-6">
          Resultado: {result === "heads" ? "Goku" : "Vegeta"} <br />
          Oponente: {opponentSide === "heads" ? "Goku" : opponentSide === "tails" ? "Vegeta" : "Aguardando..."}
        </div>
      )}
    </div>
  );
}
