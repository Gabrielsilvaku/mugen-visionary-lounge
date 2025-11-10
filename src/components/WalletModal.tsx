import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string) => void;
}

const wallets = [
  {
    name: "Phantom",
    logo: "https://phantom.app/img/phantom-logo.svg",
    gradient: "from-purple-600 to-purple-800",
  },
  {
    name: "Solflare",
    logo: "https://solflare.com/assets/solflare-logo.svg",
    gradient: "from-orange-500 to-orange-700",
  },
  {
    name: "Coin98",
    logo: "https://coin98.com/images/logo-coin98.svg",
    gradient: "from-yellow-500 to-yellow-700",
  },
];

export const WalletModal = ({ isOpen, onClose, onConnect }: WalletModalProps) => {
  const handleConnect = (walletName: string) => {
    // Simulate wallet connection
    const fakeAddress = `${walletName.slice(0, 4)}...${Math.random().toString(36).slice(2, 6)}`;
    onConnect(fakeAddress);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-2 border-primary/30 shadow-intense max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Conectar Carteira
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          {wallets.map((wallet) => (
            <Button
              key={wallet.name}
              onClick={() => handleConnect(wallet.name)}
              className={`w-full h-16 bg-gradient-to-r ${wallet.gradient} hover:opacity-90 transition-all duration-300 shadow-neon-cyan group relative overflow-hidden`}
            >
              <div className="flex items-center justify-center gap-4 relative z-10">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl">
                    {wallet.name === "Phantom" && "👻"}
                    {wallet.name === "Solflare" && "🔥"}
                    {wallet.name === "Coin98" && "💎"}
                  </span>
                </div>
                <span className="text-lg font-semibold text-white">{wallet.name}</span>
              </div>
            </Button>
          ))}
        </div>
        
        <p className="text-sm text-muted-foreground text-center mt-4">
          Ao conectar sua carteira, você concorda com nossos Termos de Serviço
        </p>
      </DialogContent>
    </Dialog>
  );
};
