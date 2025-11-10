import { Header } from "@/components/Header";
import { FloatingChat } from "@/components/FloatingChat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const Rifa = () => {
  const progress = (8500 / 17000) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FloatingChat />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-foreground mb-3 tracking-wider">MEGA SORTEIO</h1>
          <p className="text-xl text-primary">Ganhe todo o prêmio! Sorteio em 45 dias</p>
        </div>

        <Card className="max-w-4xl mx-auto bg-card-glass border-2 border-primary/40 p-8 shadow-neon-cyan">
          <div className="mb-6">
            <div className="flex justify-between mb-3">
              <span className="text-foreground font-semibold">Progresso da premiação</span>
              <span className="text-primary font-bold">$8.500 / $ 17.000</span>
            </div>
            <Progress value={progress} className="h-4" />
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-1">8500</div>
              <p className="text-sm text-muted-foreground">Ingressos vendidos</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-1">1500</div>
              <p className="text-sm text-muted-foreground">Disponível</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-1">0.01</div>
              <p className="text-sm text-muted-foreground">SOL/Bilhete</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-1">45</div>
              <p className="text-sm text-muted-foreground">Dias restantes</p>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <Input 
              placeholder="Número de bilhetes"
              className="bg-background/50 border-2 border-primary/30 text-foreground"
            />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 shadow-neon-cyan">
              Comprar ingressos
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mb-6">
            Conecte sua carteira Phantom, Solflare ou Coin98 para participar
          </p>

          <div className="bg-background/30 border border-primary/20 rounded-lg p-4">
            <h3 className="text-primary font-semibold mb-3">Como funciona:</h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li>• Compre quantos bilhetes quiser</li>
              <li>• Cada bilhete aumenta suas chances</li>
              <li>• Sorteio acontece automaticamente</li>
              <li>• O vencedor leva todo o prêmio</li>
            </ul>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Rifa;
