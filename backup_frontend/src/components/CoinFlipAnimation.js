import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function CoinFlipAnimation({ status }) {
  const [flipping, setFlipping] = useState(false)
  const [side, setSide] = useState('heads')

  useEffect(() => {
    if (status === 'waiting') return
    if (status === 'done') return

    setFlipping(true)
    setTimeout(() => {
      setSide(Math.random() > 0.5 ? 'heads' : 'tails')
      setFlipping(false)
    }, 3000)
  }, [status])

  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={flipping ? { rotateY: [0, 720] } : {}}
        transition={{ duration: 3 }}
        className="w-32 h-32 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-2xl shadow-xl"
      >
        {side === 'heads' ? '🪙' : '💫'}
      </motion.div>

      {status === 'done' && (
        <p className="mt-4 text-lg text-yellow-400">Resultado: {side === 'heads' ? 'Cara' : 'Coroa'}</p>
      )}
    </div>
  )
}
