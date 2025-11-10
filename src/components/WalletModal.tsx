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
    icon: "👻",
    color: "from-purple-600 to-blue-600",
  },
  {
    name: "Solflare",
    icon: "🔥",
    color: "from-orange-600 to-yellow-600",
  },
  {
    name: "Coin98",
    icon: "💎",
    color: "from-cyan-600 to-blue-600",
  },
];

export const WalletModal = ({ isOpen, onClose, onConnect }: WalletModalProps) => {
  const handleConnect = (walletName: string) => {
    // Simulate wallet connection with a fake address
    const fakeAddress = `${walletName.slice(0, 4)}...${Math.random().toString(36).slice(2, 6)}`;
    onConnect(fakeAddress);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-2 border-primary/30 shadow-intense">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Connect Your Wallet
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          {wallets.map((wallet) => (
            <Button
              key={wallet.name}
              onClick={() => handleConnect(wallet.name)}
              className={`w-full h-16 bg-gradient-to-r ${wallet.color} hover:opacity-90 transition-all duration-300 shadow-neon-cyan group`}
            >
              <span className="text-3xl mr-3">{wallet.icon}</span>
              <span className="text-lg font-semibold">{wallet.name}</span>
            </Button>
          ))}
        </div>
        
        <p className="text-sm text-muted-foreground text-center mt-4">
          By connecting your wallet, you agree to our Terms of Service
        </p>
      </DialogContent>
    </Dialog>
  );
};
