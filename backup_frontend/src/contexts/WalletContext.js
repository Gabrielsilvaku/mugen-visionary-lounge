import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter, Coin98WalletAdapter } from '@solana/wallet-adapter-wallets'
import { useMemo } from 'react'

require('@solana/wallet-adapter-react-ui/styles.css')

export const WalletContextProvider = ({ children }) => {
  const network = process.env.NEXT_PUBLIC_SOL_NETWORK || 'devnet'
  const endpoint = `https://api.${network}.solana.com`

  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
    new Coin98WalletAdapter()
  ], [network])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

