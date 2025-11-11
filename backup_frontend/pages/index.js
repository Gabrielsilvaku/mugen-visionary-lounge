import Link from 'next/link'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8 text-yellow-400">🔥 Mugen Visionary Lounge 🔥</h1>

      <WalletMultiButton className="mb-8" />

      <div className="flex flex-col gap-4 text-center">
        <Link href="/coinflip" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-8 rounded-xl shadow-lg transition-all">
          🎲 CoinFlip 1v1
        </Link>

        <Link href="/jackpot" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all">
          💰 Jackpot
        </Link>

        <Link href="/profile" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all">
          🧙 Perfil & Níveis
        </Link>

        <Link href="/chat" className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all">
          💬 Chat
        </Link>
      </div>
    </div>
  )
}
