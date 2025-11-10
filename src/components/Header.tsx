import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useState } from "react";
import { WalletModal } from "./WalletModal";
import logoFull from "@/assets/logo-full.jpeg";

export const Header = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-primary/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <img 
              src={logoFull} 
              alt="ZPOWERSOL CASSINO" 
              className="h-12 w-auto object-contain"
            />
            
            <nav className="hidden md:flex items-center gap-6">
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-primary hover:bg-transparent transition-colors"
              >
                Coinflip
              </Button>
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-primary hover:bg-transparent transition-colors"
              >
                Jackpot
              </Button>
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-primary hover:bg-transparent transition-colors"
              >
                Weekly Raffle
              </Button>
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-secondary hover:bg-transparent transition-colors relative group"
                disabled
              >
                Mugen Future
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-card border border-primary px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Coming Soon
                </span>
              </Button>
            </nav>
          </div>

          <Button 
            onClick={() => setIsWalletModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon-cyan font-semibold"
          >
            <Wallet className="mr-2 h-4 w-4" />
            {connectedWallet ? `${connectedWallet.slice(0, 4)}...${connectedWallet.slice(-4)}` : "Connect Wallet"}
          </Button>
        </div>
      </header>

      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={setConnectedWallet}
      />
    </>
  );
};
