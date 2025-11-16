-- Criar tabela de usuários/carteiras
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de salas de coinflip 1v1
CREATE TABLE IF NOT EXISTS public.coinflip_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_wallet TEXT NOT NULL,
  opponent_wallet TEXT,
  bet_amount DECIMAL NOT NULL,
  creator_side TEXT NOT NULL CHECK (creator_side IN ('heads', 'tails')),
  opponent_side TEXT CHECK (opponent_side IN ('heads', 'tails')),
  winner_wallet TEXT,
  result TEXT CHECK (result IN ('heads', 'tails')),
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  finished_at TIMESTAMP WITH TIME ZONE
);

-- Criar tabela de histórico de partidas
CREATE TABLE IF NOT EXISTS public.coinflip_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.coinflip_rooms(id),
  player_wallet TEXT NOT NULL,
  bet_amount DECIMAL NOT NULL,
  chosen_side TEXT NOT NULL CHECK (chosen_side IN ('heads', 'tails')),
  result TEXT NOT NULL CHECK (result IN ('heads', 'tails')),
  won BOOLEAN NOT NULL,
  payout DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coinflip_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coinflip_history ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para wallets (público - qualquer um pode ver e criar)
CREATE POLICY "Wallets são públicas para leitura" ON public.wallets FOR SELECT USING (true);
CREATE POLICY "Qualquer um pode criar wallet" ON public.wallets FOR INSERT WITH CHECK (true);

-- Políticas RLS para salas (público)
CREATE POLICY "Salas são públicas para leitura" ON public.coinflip_rooms FOR SELECT USING (true);
CREATE POLICY "Qualquer um pode criar sala" ON public.coinflip_rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Criador ou oponente pode atualizar" ON public.coinflip_rooms FOR UPDATE USING (true);

-- Políticas RLS para histórico (público)
CREATE POLICY "Histórico é público para leitura" ON public.coinflip_history FOR SELECT USING (true);
CREATE POLICY "Qualquer um pode adicionar ao histórico" ON public.coinflip_history FOR INSERT WITH CHECK (true);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_coinflip_rooms_status ON public.coinflip_rooms(status);
CREATE INDEX IF NOT EXISTS idx_coinflip_rooms_creator ON public.coinflip_rooms(creator_wallet);
CREATE INDEX IF NOT EXISTS idx_coinflip_history_wallet ON public.coinflip_history(player_wallet);

-- Habilitar realtime para salas
ALTER PUBLICATION supabase_realtime ADD TABLE public.coinflip_rooms;