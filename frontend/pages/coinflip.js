import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import CoinFlipAnimation from '@/src/components/CoinFlipAnimation'

const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000')

export default function CoinFlip() {
  const { publicKey } = useWallet()
  const [roomId, setRoomId] = useState(null)
  const [side, setSide] = useState('heads')
  const [bet, setBet] = useState('')
  const [status, setStatus] = useState('waiting')
  const [winner, setWinner] = useState(null)

  const joinRoom = () => {
    socket.emit('joinRoom', { wallet: publicKey?.toString(), side, bet })
  }

  useEffect(() => {
    socket.on('flipResult', (data) => {
      setWinner(data.winner)
      setStatus('done')
    })

    return () => {
      socket.off('flipResult')
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">🎲 CoinFlip 1v1</h1>

      <WalletMultiButton className="mb-4" />

      {publicKey ? (
        <div className="flex flex-col gap-4 items-center">
          <div className="flex gap-4">
            <button
              className={`py-2 px-6 rounded-lg font-semibold ${side === 'heads' ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}
              onClick={() => setSide('heads')}
            >
              Cara
            </button>
            <button
              className={`py-2 px-6 rounded-lg font-semibold ${side === 'tails' ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}
              onClick={() => setSide('tails')}
            >
              Coroa
            </button>
          </div>

          <input
            type="number"
            placeholder="Valor da aposta (SOL)"
            value={bet}
            onChange={(e) => setBet(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white text-center"
          />

          <button
            onClick={joinRoom}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-xl shadow-lg transition-all"
          >
            Entrar / Criar sala
          </button>

          {status === 'done' && (
            <div className="mt-4 text-xl">
              🏆 Vencedor: <span className="text-yellow-400">{winner}</span>
            </div>
          )}

          <div className="mt-8">
            <CoinFlipAnimation status={status} />
          </div>
        </div>
      ) : (
        <p className="text-gray-400">Conecte sua carteira para jogar.</p>
      )}
    </div>
  )
}
