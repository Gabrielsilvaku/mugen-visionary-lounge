import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { WalletModal } from "@/components/WalletModal";
import { useNavigate } from "react-router-dom";
import logoFull from "@/assets/logo-full.jpeg";
import logoCharacter from "@/assets/logo-character.jpeg";

const Home = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background Character */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20">
        <img 
          src={logoCharacter} 
          alt="Background" 
          className="h-full w-full object-contain"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-7xl font-bold text-foreground tracking-wider mb-4 animate-fade-in">
            ZPOWERSOL
          </h1>
          <p className="text-3xl text-primary tracking-widest animate-fade-in">CASSINO</p>
        </div>

        <div className="flex justify-center gap-6 mb-16">
          <Button 
            onClick={() => navigate('/rifa')}
            className="bg-transparent border-2 border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg font-semibold shadow-neon-cyan"
          >
            Enter Casino
          </Button>
          <Button 
            onClick={() => setIsWalletModalOpen(true)}
            className="bg-transparent border-2 border-secondary text-secondary hover:bg-secondary/10 px-8 py-6 text-lg font-semibold shadow-neon-purple"
          >
            Connect Wallet
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-card-glass border-2 border-primary/40 p-6 text-center shadow-neon-cyan hover:border-primary transition-all">
            <div className="text-4xl font-bold text-primary mb-2">$17.000</div>
            <p className="text-muted-foreground">Raffle Prize Pool</p>
          </Card>
          
          <Card className="bg-card-glass border-2 border-secondary/40 p-6 text-center shadow-neon-purple hover:border-secondary transition-all">
            <div className="text-4xl font-bold text-secondary mb-2">10.000+</div>
            <p className="text-muted-foreground">Raffle Tickets</p>
          </Card>
          
          <Card className="bg-card-glass border-2 border-primary/40 p-6 text-center shadow-neon-cyan hover:border-primary transition-all">
            <div className="text-4xl font-bold text-primary mb-2">0.01 SOL</div>
            <p className="text-muted-foreground">Per Ticket</p>
          </Card>
        </div>
      </div>

      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={() => setIsWalletModalOpen(false)}
      />
    </div>
  );
};

export default Home;
