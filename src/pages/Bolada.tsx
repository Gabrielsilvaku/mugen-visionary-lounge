import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default function JackpotDB() {
  const [players, setPlayers] = useState([]);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    socket.on("jackpotUpdate", setPlayers);
    socket.on("jackpotWinner", setWinner);
  }, []);

  const join = () => socket.emit("joinJackpot", Math.floor(Math.random() * 10 + 1));
  const draw = () => socket.emit("drawJackpot");

  return (
    <div className="min-h-screen bg-purple-100 flex flex-col items-center justify-start py-12">
      <h1 className="text-4xl font-bold mb-6">Jackpot Dragon Ball</h1>
      <div className="flex gap-4 mb-4">
        <button onClick={join} className="px-6 py-3 bg-yellow-400 rounded-lg shadow hover:scale-105 transition-transform">Entrar</button>
        <button onClick={draw} className="px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:scale-105 transition-transform">Sortear</button>
      </div>

      <ul className="mb-4">
        {players.map(p => <li key={p.id}>{p.id}: {p.bet} SOL</li>)}
      </ul>

      {winner && <div className="text-2xl font-bold">Vencedor: {winner.id} ganhou {winner.bet} SOL</div>}
    </div>
  );
}
