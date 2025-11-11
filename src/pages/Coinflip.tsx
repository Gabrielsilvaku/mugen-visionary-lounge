import { Header } from "@/components/Header";
import { FloatingChat } from "@/components/FloatingChat";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import coinHeads from "@/assets/coin-heads.png";

const Coinflip = () => {
  const [betAmount, setBetAmount] = useState("0,1");
  const [selectedSide, setSelectedSide] = useState<"heads" | "tails" | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);

  const handleFlip = () => {
    if (!selectedSide) return;
    
    setIsFlipping(true);
    setResult(null);
    
    // Simulate coin flip result after 3 seconds
    setTimeout(() => {
      const flipResult = Math.random() > 0.5 ? "heads" : "tails";
      setResult(flipResult);
      setIsFlipping(false);
      
      // Show notification
      if (flipResult === selectedSide) {
        toast.success("🎉 Você ganhou!", {
          description: `Ganhou ${parseFloat(betAmount.replace(',', '.')) * 2} SOL`
        });
      } else {
        toast.error("😔 Você perdeu", {
          description: `Perdeu ${betAmount} SOL`
        });
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FloatingChat />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-foreground mb-3 tracking-wider">COINFLIP</h1>
          <p className="text-xl text-primary">O dobro ou nada! Escolha o seu lado</p>
        </div>

        {(isFlipping || result) && (
          <div className="flex flex-col items-center mb-8">
            <img 
              src={coinHeads} 
              alt="Coin" 
              className={`w-32 h-32 ${isFlipping ? 'animate-[spin_0.5s_linear_infinite]' : ''}`}
            />
            {result && !isFlipping && (
              <div className={`mt-4 text-2xl font-bold ${result === selectedSide ? 'text-green-500' : 'text-red-500'}`}>
                {result === "heads" ? "Z (Cara)" : "M (Coroa)"}
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
            {/* Cabeças (Z) - Cyan */}
            <button
              onClick={() => setSelectedSide("heads")}
              className={`bg-background/50 border-3 ${
                selectedSide === "heads" ? "border-primary shadow-intense" : "border-primary/30"
              } rounded-lg p-8 hover:border-primary transition-all group`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`w-32 h-32 rounded-full border-4 ${
                  selectedSide === "heads" ? "border-primary" : "border-primary/50"
                } flex items-center justify-center group-hover:border-primary transition-all`}>
                  <div className={`w-24 h-24 rounded-full border-4 ${
                    selectedSide === "heads" ? "border-primary" : "border-primary/50"
                  } group-hover:border-primary transition-all`} />
                </div>
                <div className="text-5xl font-bold text-primary">Z</div>
                <div className="text-sm text-muted-foreground">CABEÇAS</div>
                <div className="text-lg font-semibold text-primary">2x Vitória</div>
              </div>
            </button>

            {/* Coroa (M) - Purple */}
            <button
              onClick={() => setSelectedSide("tails")}
              className={`bg-background/50 border-3 ${
                selectedSide === "tails" ? "border-secondary shadow-neon-purple" : "border-secondary/30"
              } rounded-lg p-8 hover:border-secondary transition-all group`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`w-32 h-32 rounded-full border-4 ${
                  selectedSide === "tails" ? "border-secondary" : "border-secondary/50"
                } flex items-center justify-center group-hover:border-secondary transition-all`}>
                  <div className={`w-24 h-24 rounded-full border-4 ${
                    selectedSide === "tails" ? "border-secondary" : "border-secondary/50"
                  } group-hover:border-secondary transition-all`} />
                </div>
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
