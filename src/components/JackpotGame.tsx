import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Timer } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const JackpotGame = () => {
  const players = [
    { name: "CryptoWhale", amount: 25.5, color: "bg-primary" },
    { name: "DiamondHands", amount: 18.0, color: "bg-secondary" },
    { name: "MoonBoy", amount: 12.5, color: "bg-neon-cyan" },
    { name: "HODLer", amount: 8.0, color: "bg-neon-purple" },
  ];

  const totalPool = players.reduce((sum, p) => sum + p.amount, 0);

  return (
    <Card className="bg-card-glass border-2 border-secondary/30 p-6 shadow-neon-purple">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="h-6 w-6 text-secondary" />
        <h2 className="text-2xl font-bold text-foreground">Jackpot</h2>
        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <Timer className="h-4 w-4" />
          <span>2:45 left</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-muted-foreground">Total Pool</span>
          <span className="text-2xl font-bold text-secondary">{totalPool.toFixed(2)} SOL</span>
        </div>
        <Progress value={75} className="h-3" />
      </div>

      <div className="space-y-3 mb-6">
        {players.map((player, idx) => {
          const chance = ((player.amount / totalPool) * 100).toFixed(1);
          return (
            <div key={idx} className="bg-background/30 border border-secondary/20 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${player.color}`} />
                  <span className="font-semibold text-foreground">{player.name}</span>
                </div>
                <span className="text-secondary font-bold">{chance}%</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {player.amount} SOL
              </div>
            </div>
          );
        })}
      </div>

      <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 shadow-intense font-semibold">
        Enter Jackpot
      </Button>
    </Card>
  );
};
