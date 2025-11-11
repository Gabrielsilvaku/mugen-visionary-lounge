import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { connectWallet, detectWallets } from "@/lib/solana";
import { X } from "lucide-react";
import phantomLogo from "@/assets/phantom-logo.png";
import solflareLogo from "@/assets/solflare-logo.png";
import coin98Logo from "@/assets/coin98-logo.png";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string, walletType: string) => void;
}

const wallets = [
  {
    name: "Phantom",
    key: "phantom",
    logo: phantomLogo,
  },
  {
    name: "Solflare",
    key: "solflare",
    logo: solflareLogo,
  },
  {
    name: "Coin98",
    key: "coin98",
    logo: coin98Logo,
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
      <DialogContent className="bg-background border-2 border-border max-w-sm p-0">
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
          
          <div className="px-6 pb-6 flex gap-4 justify-center">
            {wallets.map((wallet) => (
              <button
                key={wallet.key}
                onClick={() => handleConnect(wallet.key, wallet.name)}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-all group"
              >
                <div className="w-14 h-14 rounded-lg bg-background border border-border flex items-center justify-center group-hover:border-primary transition-all">
                  <img 
                    src={wallet.logo} 
                    alt={wallet.name}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <span className="text-sm text-foreground font-medium">{wallet.name}</span>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
