import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { connectWallet, detectWallets } from "@/lib/solana";
import { X } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string, walletType: string) => void;
}

const wallets = [
  {
    name: "Phantom",
    key: "phantom",
    icon: "👻",
    color: "bg-purple-600",
  },
  {
    name: "Solflare",
    key: "solflare",
    icon: "☀️",
    color: "bg-orange-600",
  },
  {
    name: "Coin98",
    key: "coin98",
    icon: "🎯",
    color: "bg-yellow-600",
  },
];

export const WalletModal = ({ isOpen, onClose, onConnect }: WalletModalProps) => {
  const handleConnect = async (walletKey: string, walletName: string) => {
    try {
      const installedWallets = detectWallets();
      
      if (walletKey === 'phantom' && !installedWallets.phantom) {
        toast.error("Phantom not installed", {
          description: "Please install Phantom extension"
        });
        window.open('https://phantom.app/', '_blank');
        return;
      }
      
      if (walletKey === 'solflare' && !installedWallets.solflare) {
        toast.error("Solflare not installed", {
          description: "Please install Solflare extension"
        });
        window.open('https://solflare.com/', '_blank');
        return;
      }
      
      if (walletKey === 'coin98' && !installedWallets.coin98) {
        toast.error("Coin98 not installed", {
          description: "Please install Coin98 extension"
        });
        window.open('https://coin98.com/', '_blank');
        return;
      }
      
      toast.loading("Connecting...");
      const address = await connectWallet(walletKey as 'phantom' | 'solflare' | 'coin98');
      toast.dismiss();
      toast.success("Wallet connected!");
      onConnect(address, walletKey);
      onClose();
    } catch (error: any) {
      toast.dismiss();
      toast.error("Error connecting", {
        description: error.message || "Try again"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background border-2 border-border max-w-md p-0">
        <div className="relative">
          <Button
            onClick={onClose}
            size="icon"
            className="absolute top-4 right-4 h-8 w-8 bg-transparent border-0 text-muted-foreground hover:text-foreground hover:bg-transparent z-10"
          >
            <X size={20} />
          </Button>
          
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-semibold text-center text-foreground">
              Connect a wallet on
              <br />
              Solana to continue
            </DialogTitle>
          </DialogHeader>
          
          <div className="px-6 pb-6 space-y-2">
            {wallets.map((wallet) => (
              <Button
                key={wallet.key}
                onClick={() => handleConnect(wallet.key, wallet.name)}
                className="w-full bg-transparent border-0 hover:bg-accent justify-start h-14 text-base font-normal"
                variant="ghost"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${wallet.color} flex items-center justify-center text-xl`}>
                    {wallet.icon}
                  </div>
                  <span className="text-foreground">{wallet.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
