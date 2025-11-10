import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Coins, Users } from "lucide-react";

export const CoinflipGame = () => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);

  const handleFlip = () => {
    setIsFlipping(true);
    setResult(null);
    
    setTimeout(() => {
      setResult(Math.random() > 0.5 ? "heads" : "tails");
      setIsFlipping(false);
    }, 1000);
  };

  const mockGames = [
    { id: 1, player: "User1234", amount: 5.5, side: "heads", status: "waiting" },
    { id: 2, player: "CryptoKing", amount: 10.0, side: "tails", status: "active" },
    { id: 3, player: "SolMaster", amount: 2.5, side: "heads", status: "waiting" },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-card-glass border-2 border-primary/30 p-6 shadow-neon-cyan">
        <div className="flex items-center gap-3 mb-6">
          <Coins className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Coinflip Multiplayer</h2>
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>42 Online</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center bg-background/50 rounded-lg p-8 border border-primary/20">
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold mb-4 ${isFlipping ? "animate-spin-coin" : ""}`}>
              {result ? (result === "heads" ? "H" : "T") : "?"}
            </div>
            
            <Button 
              onClick={handleFlip} 
              disabled={isFlipping}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon-cyan"
            >
              {isFlipping ? "Flipping..." : "Flip Coin"}
            </Button>
            
            {result && (
              <p className="mt-4 text-lg font-semibold text-primary animate-fade-in">
                Result: {result.toUpperCase()}!
              </p>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground mb-3">Active Games</h3>
            {mockGames.map((game) => (
              <Card key={game.id} className="bg-background/30 border border-primary/20 p-4 hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{game.player}</p>
                    <p className="text-sm text-muted-foreground">
                      {game.amount} SOL • {game.side}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  >
                    Join
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
