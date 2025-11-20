-- Criar tabela de perfis de usuários com sistema de níveis
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  level INTEGER DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  total_won NUMERIC DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de chat em tempo real
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  username TEXT,
  message TEXT NOT NULL,
  room TEXT DEFAULT 'global',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de notificações
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de tickets de suporte
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de logs admin
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  wallet_address TEXT,
  ip_address TEXT,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies para user_profiles
CREATE POLICY "Perfis são públicos para leitura" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Usuários podem criar seu perfil" ON public.user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Usuários podem atualizar seu perfil" ON public.user_profiles FOR UPDATE USING (true);

-- RLS Policies para chat
CREATE POLICY "Chat é público para leitura" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Qualquer um pode enviar mensagem" ON public.chat_messages FOR INSERT WITH CHECK (true);

-- RLS Policies para notifications
CREATE POLICY "Usuários veem suas notificações" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Sistema pode criar notificações" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Usuários podem marcar como lida" ON public.notifications FOR UPDATE USING (true);

-- RLS Policies para support_tickets
CREATE POLICY "Usuários veem seus tickets" ON public.support_tickets FOR SELECT USING (true);
CREATE POLICY "Usuários podem criar tickets" ON public.support_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Usuários podem atualizar seus tickets" ON public.support_tickets FOR UPDATE USING (true);

-- RLS Policies para admin_logs (apenas leitura pública por enquanto)
CREATE POLICY "Admin logs são públicos" ON public.admin_logs FOR SELECT USING (true);
CREATE POLICY "Sistema pode criar logs" ON public.admin_logs FOR INSERT WITH CHECK (true);

-- Enable realtime para chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Criar função para atualizar nível baseado em gasto
CREATE OR REPLACE FUNCTION public.update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level = FLOOR(NEW.total_spent / 10)::INTEGER;
  IF NEW.level > 100 THEN
    NEW.level = 100;
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar nível automaticamente
CREATE TRIGGER update_level_on_spent
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  WHEN (OLD.total_spent IS DISTINCT FROM NEW.total_spent)
  EXECUTE FUNCTION public.update_user_level();