import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { connectWallet, detectWallets } from "@/lib/solana";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string, walletType: string) => void;
}

const wallets = [
  {
    name: "Fantasma",
    key: "phantom",
    icon: "👻",
    color: "from-purple-600 to-purple-800",
  },
  {
    name: "Carteira Coinbase",
    key: "coinbase",
    icon: "🔵",
    color: "from-blue-600 to-blue-800",
  },
  {
    name: "Solflare",
    key: "solflare",
    icon: "🔥",
    color: "from-orange-500 to-orange-700",
  },
  {
    name: "Livro-Razão",
    key: "ledger",
    icon: "📱",
    color: "from-gray-600 to-gray-800",
  },
  {
    name: "Moeda 98",
    key: "coin98",
    icon: "💎",
    color: "from-yellow-500 to-yellow-700",
  },
  {
    name: "Toro",
    key: "toro",
    icon: "🐂",
    color: "from-blue-500 to-blue-700",
  },
  {
    name: "Brilhar",
    key: "glow",
    icon: "✨",
    color: "from-pink-500 to-pink-700",
  },
  {
    name: "Mochila",
    key: "backpack",
    icon: "🎒",
    color: "from-red-600 to-red-800",
  },
  {
    name: "Declive",
    key: "slope",
    icon: "⛷️",
    color: "from-purple-500 to-purple-700",
  },
];

export const WalletModal = ({ isOpen, onClose, onConnect }: WalletModalProps) => {
  const handleConnect = async (walletKey: string, walletName: string) => {
    try {
      // Check if wallet is installed for real wallets
      if (walletKey === 'phantom' || walletKey === 'solflare' || walletKey === 'coin98') {
        const installedWallets = detectWallets();
        
        if (walletKey === 'phantom' && !installedWallets.phantom) {
          toast.error("Phantom não instalado", {
            description: "Por favor, instale a extensão Phantom"
          });
          window.open('https://phantom.app/', '_blank');
          return;
        }
        
        if (walletKey === 'solflare' && !installedWallets.solflare) {
          toast.error("Solflare não instalado", {
            description: "Por favor, instale a extensão Solflare"
          });
          window.open('https://solflare.com/', '_blank');
          return;
        }
        
        if (walletKey === 'coin98' && !installedWallets.coin98) {
          toast.error("Coin98 não instalado", {
            description: "Por favor, instale a extensão Coin98"
          });
          window.open('https://coin98.com/', '_blank');
          return;
        }
        
        // Try to connect
        toast.loading("Conectando...");
        const address = await connectWallet(walletKey as 'phantom' | 'solflare' | 'coin98');
        toast.dismiss();
        toast.success("Carteira conectada!");
        onConnect(address, walletKey);
        onClose();
      } else {
        // For other wallets, show coming soon
        toast.info(`${walletName} em breve!`);
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error("Erro ao conectar", {
        description: error.message || "Tente novamente"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-2 border-primary/30 shadow-intense max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-foreground mb-2">
            CONECTE CARTEIRA
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 py-2">
          {wallets.map((wallet) => (
            <Button
              key={wallet.key}
              onClick={() => handleConnect(wallet.key, wallet.name)}
              className={`w-full h-14 bg-card-glass border border-primary/20 hover:border-primary/50 transition-all duration-300 justify-start text-left`}
              variant="ghost"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${wallet.color} flex items-center justify-center text-xl`}>
                  {wallet.icon}
                </div>
                <span className="text-base font-medium text-foreground uppercase tracking-wide">
                  {wallet.name}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
