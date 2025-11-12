import { Header } from "@/components/Header";
import { FloatingChat } from "@/components/FloatingChat";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import coinHeads from "@/assets/coin-heads.png";
import coinTails from "@/assets/coin-tails.png";

// Função para simular o lado do oponente (bot)
const getOpponentSide = () => (Math.random() > 0.5 ? "heads" : "tails");

const Coinflip = () => {
  const [betAmount, setBetAmount] = useState("0,1");
  const [selectedSide, setSelectedSide] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [opponentSide, setOpponentSide] = useState(null);
  const [spinClass, setSpinClass] = useState("");

  const handleFlip = () => {
    if (!selectedSide) return;

    setIsFlipping(true);
    setResult(null);

    // Determina lado do oponente
    const opponent = opponentSide || getOpponentSide();
    setOpponentSide(opponent);

    // Adiciona animação de spin
    setSpinClass("animate-spin");

    setTimeout(() => {
      setSpinClass(""); // Para animação
      const flipResult = Math.random() > 0.5 ? "heads" : "tails";
      setResult(flipResult);
      setIsFlipping(false);

      // Notificação de vitória ou derrota
      if (flipResult === selectedSide) {
        toast.success("🎉 Você ganhou!", {
          description: `Ganhou ${parseFloat(betAmount.replace(',', '.')) * 2} SOL`
        });
      } else {
        toast.error("😔 Você perdeu", {
          description: `Perdeu ${betAmount} SOL`
        });
      }
    }, 2000); // duração da simulação do flip
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FloatingChat />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-foreground mb-3 tracking-wider">COINFLIP 1v1</h1>
          <p className="text-xl text-primary">Escolha um lado e desafie outro jogador ou o bot</p>
        </div>

        {(isFlipping || result) && (
          <div className="flex flex-col items-center mb-8">
            <img
              src={result === "heads" ? coinHeads : coinTails}
              alt="Coin"
              className={`w-32 h-32 ${spinClass}`}
            />
            {result && !isFlipping && (
              <div className={`mt-4 text-2xl font-bold ${result === selectedSide ? 'text-green-500' : 'text-red-500'}`}>
                Resultado: {result === "heads" ? "Z (Cara)" : "M (Coroa)"}
                {opponentSide && (
                  <><br />Oponente: {opponentSide === "heads" ? "Z (Cara)" : "M (Coroa)"}</>
                )}
              </div>
            )}
          </div>
        )}

        <Card className="max-w-4xl mx-auto bg-card-glass border-2 border-secondary/40 p-8 shadow-neon-purple">
          <div className="mb-8">
            <label className="block text-center text-foreground mb-3 font-semibold">
              Valor da aposta (SOL)
            </label>
            <Input
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="bg-background/50 border-2 border-primary/30 text-foreground text-center text-2xl font-bold max-w-sm mx-auto"
            />
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => setSelectedSide("heads")}
              className={`bg-background/50 border-3 ${
                selectedSide === "heads" ? "border-primary shadow-intense" : "border-primary/30"
              } rounded-lg p-8 hover:border-primary transition-all group`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="text-5xl font-bold text-primary">Z</div>
                <div className="text-sm text-muted-foreground">CABEÇAS</div>
                <div className="text-lg font-semibold text-primary">2x Vitória</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedSide("tails")}
              className={`bg-background/50 border-3 ${
                selectedSide === "tails" ? "border-secondary shadow-neon-purple" : "border-secondary/30"
              } rounded-lg p-8 hover:border-secondary transition-all group`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="text-5xl font-bold text-secondary">M</div>
                <div className="text-sm text-muted-foreground">COROA</div>
                <div className="text-lg font-semibold text-secondary">2x Vitória</div>
              </div>
            </button>
          </div>

          <Button
            onClick={handleFlip}
            disabled={!selectedSide || isFlipping}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 py-6 text-xl font-bold shadow-intense"
          >
            {isFlipping ? "GIRANDO..." : selectedSide ? "Lançar Moeda" : "Escolha um lado"}
          </Button>
        </Card>
      </main>
    </div>
  );
};

export default Coinflip;
