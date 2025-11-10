import { Button } from "@/components/ui/button";
import { Bell, User, Shield, LogOut } from "lucide-react";
import { useState } from "react";
import { WalletModal } from "./WalletModal";
import { Link, useLocation } from "react-router-dom";
import logoCharacter from "@/assets/logo-character.jpeg";

export const Header = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-primary/20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={logoCharacter} 
              alt="ZPOWERSOL" 
              className="h-12 w-12 object-contain"
            />
            <div>
              <div className="text-xl font-bold text-foreground tracking-wider">ZPOWERSOL</div>
              <div className="text-xs text-muted-foreground">CASSINO</div>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/rifa">
              <Button 
                variant="ghost" 
                className={`text-foreground hover:text-primary hover:bg-transparent transition-colors ${isActive('/rifa') ? 'text-primary' : ''}`}
              >
                Rifa
              </Button>
            </Link>
            <Link to="/coinflip">
              <Button 
                variant="ghost" 
                className={`text-foreground hover:text-primary hover:bg-transparent transition-colors ${isActive('/coinflip') ? 'text-primary' : ''}`}
              >
                Coinflip
              </Button>
            </Link>
            <Link to="/bolada">
              <Button 
                variant="ghost" 
                className={`text-foreground hover:text-primary hover:bg-transparent transition-colors ${isActive('/bolada') ? 'text-primary' : ''}`}
              >
                Bolada
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-foreground hover:text-primary"
            >
              <Bell className="h-5 w-5" />
            </Button>
            
            {connectedWallet ? (
              <>
                <Button 
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </Button>
                <Button 
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </Button>
                <Button 
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={() => setConnectedWallet(null)}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </>
            ) : null}
          </div>
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
