import { Header } from "@/components/Header";
import { FloatingChat } from "@/components/FloatingChat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Bolada = () => {
  const players = [
    { name: "Jogador 1", chance: 35, color: "bg-primary", amount: 850 },
    { name: "Jogador 2", chance: 25, color: "bg-secondary", amount: 600 },
    { name: "Jogador 3", chance: 20, color: "bg-pink-500", amount: 500 },
    { name: "Jogador 4", chance: 12, color: "bg-yellow-500", amount: 300 },
    { name: "Jogador 5", chance: 8, color: "bg-green-500", amount: 200 },
  ];

  const totalPool = players.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FloatingChat />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-foreground mb-3 tracking-wider">BOLADA</h1>
          <p className="text-xl text-primary">Deposite para aumentar sua chance de ganhar</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Prize Pool Card */}
          <Card className="bg-card-glass border-2 border-primary/40 p-8 text-center shadow-intense">
            <div className="text-6xl font-bold text-primary mb-4 drop-shadow-[0_0_25px_rgba(0,255,255,0.5)]">
              {totalPool.toFixed(2)} SOL
            </div>
            <p className="text-muted-foreground mb-8">Premiação atual</p>

            {/* Circular Progress Wheel - Spinning */}
            <div className="relative w-64 h-64 mx-auto mb-8">
              <svg className="w-full h-full -rotate-90 animate-[spin_10s_linear_infinite]">
                {/* Background circle */}
                <circle
                  cx="128"
                  cy="128"
                  r="100"
                  fill="none"
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="20"
                />
                
                {/* Player segments */}
                {players.map((player, idx) => {
                  const previousTotal = players.slice(0, idx).reduce((sum, p) => sum + p.chance, 0);
                  const offset = (previousTotal / 100) * 628;
                  const length = (player.chance / 100) * 628;
                  
                  return (
                    <circle
                      key={idx}
                      cx="128"
                      cy="128"
                      r="100"
                      fill="none"
                      className={player.color.replace('bg-', 'stroke-')}
                      strokeWidth="20"
                      strokeDasharray={`${length} 628`}
                      strokeDashoffset={-offset}
                      opacity="0.8"
                    />
                  );
                })}
              </svg>
              
              {/* Center text - NOT rotating */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-foreground animate-glow-pulse">FIAR</div>
                <div className="text-sm text-muted-foreground">GANHAR</div>
              </div>
              
              {/* Winner indicator arrow at top */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
              </div>
            </div>
          </Card>

          {/* Players List */}
          <Card className="bg-card-glass border-2 border-primary/40 p-6 shadow-neon-cyan">
            <div className="space-y-4">
              {players.map((player, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between bg-background/30 border border-primary/20 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${player.color}`} />
                    <span className="font-semibold text-foreground">{player.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{player.chance}%</div>
                    <div className="text-sm text-muted-foreground">Chance de ganhar</div>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-xl font-bold shadow-neon-cyan">
              Junte-se ao Jackpot
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Bolada;
