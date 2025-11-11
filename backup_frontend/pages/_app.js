oimport '@/styles/globals.css'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { useMemo } from 'react'
import Head from 'next/head'

require('@solana/wallet-adapter-react-ui/styles.css')

export default function App({ Component, pageProps }) {
  const endpoint = 'https://api.devnet.solana.com'
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  return (
    <>
      <Head>
        <title>Solana Cassino</title>
      </Head>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Component {...pageProps} />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  )
}
