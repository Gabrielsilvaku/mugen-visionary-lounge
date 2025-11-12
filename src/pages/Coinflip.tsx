import { useState, useEffect } from "react";
import coinHeads from "@/assets/coin-heads.png";
import coinTails from "@/assets/coin-tails.png";

const Coinflip = () => {
  const [player1Side, setPlayer1Side] = useState<"heads" | "tails" | null>(null);
  const [player2Side, setPlayer2Side] = useState<"heads" | "tails" | null>(null);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = () => {
    if (!player1Side) return;
    setIsFlipping(true);

    // Simula adversário automático
    const botSide = Math.random() > 0.5 ? "heads" : "tails";
    setPlayer2Side(botSide);

    setTimeout(() => {
      const flipResult = Math.random() > 0.5 ? "heads" : "tails";
      setResult(flipResult);
      setIsFlipping(false);
    }, 2000);
  };

  return (
    <div>
      <h1>COINFLIP 1v1</h1>

      <div>
        <button onClick={() => setPlayer1Side("heads")}>Cara (Z)</button>
        <button onClick={() => setPlayer1Side("tails")}>Coroa (M)</button>
      </div>

      <button onClick={handleFlip} disabled={!player1Side || isFlipping}>
        {isFlipping ? "Girando..." : "Lançar Moeda"}
      </button>

      {result && (
        <div>
          Resultado: {result === "heads" ? "Z (Cara)" : "M (Coroa)"} <br />
          Oponente: {player2Side === "heads" ? "Z (Cara)" : "M (Coroa)"}
        </div>
      )}

      {isFlipping && <img src={coinHeads} alt="coin" className="animate-spin" />}
    </div>
  );
};

export default Coinflip;
