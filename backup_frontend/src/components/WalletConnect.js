import { useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import axios from 'axios'

export default function WalletConnect() {
  const { publicKey } = useWallet()

  useEffect(() => {
    if (!publicKey) return

    const wallet = publicKey.toString()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

    // Cria ou atualiza perfil
    axios.post(`${apiUrl}/api/profile`, { wallet })
      .then(res => {
        console.log('Perfil carregado:', res.data)
      })
      .catch(err => {
        console.error('Erro ao criar perfil:', err)
      })
  }, [publicKey])

  return null
}
