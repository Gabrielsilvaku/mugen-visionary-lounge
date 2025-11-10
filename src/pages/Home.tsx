import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { WalletModal } from "@/components/WalletModal";
import { useNavigate } from "react-router-dom";
import bannerFull from "@/assets/banner-full.jpeg";

const Home = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background Banner */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src={bannerFull} 
          alt="ZPOWERSOL CASSINO" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-8xl font-bold text-foreground tracking-wider mb-4 drop-shadow-[0_0_30px_rgba(0,255,255,0.5)]">
            ZPOWERSOL
          </h1>
          <p className="text-4xl text-primary tracking-widest drop-shadow-[0_0_20px_rgba(0,255,255,0.3)]">
            CASSINO
          </p>
        </div>

        <div className="flex justify-center gap-6 mb-16">
          <Button 
            onClick={() => navigate('/rifa')}
            className="bg-transparent border-2 border-primary text-primary hover:bg-primary/10 px-12 py-8 text-xl font-semibold shadow-neon-cyan hover:shadow-intense transition-all"
          >
            Enter Casino
          </Button>
          <Button 
            onClick={() => setIsWalletModalOpen(true)}
            className="bg-transparent border-2 border-secondary text-secondary hover:bg-secondary/10 px-12 py-8 text-xl font-semibold shadow-neon-purple hover:shadow-intense transition-all"
          >
            Connect Wallet
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-card-glass border-2 border-primary/40 p-8 text-center shadow-neon-cyan hover:border-primary hover:scale-105 transition-all">
            <div className="text-5xl font-bold text-primary mb-2 drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]">
              $17.000
            </div>
            <p className="text-muted-foreground">Raffle Prize Pool</p>
          </Card>
          
          <Card className="bg-card-glass border-2 border-secondary/40 p-8 text-center shadow-neon-purple hover:border-secondary hover:scale-105 transition-all">
            <div className="text-5xl font-bold text-secondary mb-2 drop-shadow-[0_0_20px_rgba(255,0,255,0.5)]">
              10.000+
            </div>
            <p className="text-muted-foreground">Raffle Tickets</p>
          </Card>
          
          <Card className="bg-card-glass border-2 border-primary/40 p-8 text-center shadow-neon-cyan hover:border-primary hover:scale-105 transition-all">
            <div className="text-5xl font-bold text-primary mb-2 drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]">
              0.01 SOL
            </div>
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
