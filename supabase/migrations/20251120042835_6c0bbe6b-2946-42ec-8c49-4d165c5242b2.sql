-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update RLS policies for admin_logs
DROP POLICY IF EXISTS "Admin logs são públicos" ON public.admin_logs;
DROP POLICY IF EXISTS "Sistema pode criar logs" ON public.admin_logs;

CREATE POLICY "Only admins can view logs"
ON public.admin_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can create logs"
ON public.admin_logs
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update RLS policies for notifications
DROP POLICY IF EXISTS "Usuários veem suas notificações" ON public.notifications;
DROP POLICY IF EXISTS "Usuários podem marcar como lida" ON public.notifications;
DROP POLICY IF EXISTS "Sistema pode criar notificações" ON public.notifications;

CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (wallet_address IN (
  SELECT wallet_address FROM public.user_profiles WHERE id = auth.uid()
));

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (wallet_address IN (
  SELECT wallet_address FROM public.user_profiles WHERE id = auth.uid()
));

CREATE POLICY "Admins can create notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update RLS policies for support_tickets
DROP POLICY IF EXISTS "Usuários veem seus tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Usuários podem criar tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Usuários podem atualizar seus tickets" ON public.support_tickets;

CREATE POLICY "Users can view their own tickets"
ON public.support_tickets
FOR SELECT
TO authenticated
USING (
  wallet_address IN (
    SELECT wallet_address FROM public.user_profiles WHERE id = auth.uid()
  ) OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Authenticated users can create tickets"
ON public.support_tickets
FOR INSERT
TO authenticated
WITH CHECK (
  wallet_address IN (
    SELECT wallet_address FROM public.user_profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "Users can update their own tickets"
ON public.support_tickets
FOR UPDATE
TO authenticated
USING (
  wallet_address IN (
    SELECT wallet_address FROM public.user_profiles WHERE id = auth.uid()
  ) OR public.has_role(auth.uid(), 'admin')
);

-- Update user_profiles to link to auth.users
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update RLS policies for user_profiles
DROP POLICY IF EXISTS "Perfis são públicos para leitura" ON public.user_profiles;
DROP POLICY IF EXISTS "Usuários podem criar seu perfil" ON public.user_profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu perfil" ON public.user_profiles;

CREATE POLICY "Users can view all profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create their own profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Update coinflip_rooms policies to require authentication
DROP POLICY IF EXISTS "Salas são públicas para leitura" ON public.coinflip_rooms;
DROP POLICY IF EXISTS "Qualquer um pode criar sala" ON public.coinflip_rooms;
DROP POLICY IF EXISTS "Criador ou oponente pode atualizar" ON public.coinflip_rooms;

CREATE POLICY "Authenticated users can view rooms"
ON public.coinflip_rooms
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create rooms"
ON public.coinflip_rooms
FOR INSERT
TO authenticated
WITH CHECK (
  creator_wallet IN (
    SELECT wallet_address FROM public.user_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Creator or opponent can update room"
ON public.coinflip_rooms
FOR UPDATE
TO authenticated
USING (
  creator_wallet IN (
    SELECT wallet_address FROM public.user_profiles WHERE user_id = auth.uid()
  ) OR opponent_wallet IN (
    SELECT wallet_address FROM public.user_profiles WHERE user_id = auth.uid()
  )
);

-- Update coinflip_history policies
DROP POLICY IF EXISTS "Histórico é público para leitura" ON public.coinflip_history;
DROP POLICY IF EXISTS "Qualquer um pode adicionar ao histórico" ON public.coinflip_history;

CREATE POLICY "Authenticated users can view history"
ON public.coinflip_history
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "System can add to history"
ON public.coinflip_history
FOR INSERT
TO authenticated
WITH CHECK (
  player_wallet IN (
    SELECT wallet_address FROM public.user_profiles WHERE user_id = auth.uid()
  )
);

-- Update chat_messages policies
DROP POLICY IF EXISTS "Chat é público para leitura" ON public.chat_messages;
DROP POLICY IF EXISTS "Qualquer um pode enviar mensagem" ON public.chat_messages;

CREATE POLICY "Authenticated users can view messages"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can send messages"
ON public.chat_messages
FOR INSERT
TO authenticated
WITH CHECK (
  wallet_address IN (
    SELECT wallet_address FROM public.user_profiles WHERE user_id = auth.uid()
  )
);

-- Create trigger to auto-create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, wallet_address)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'wallet_address')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();