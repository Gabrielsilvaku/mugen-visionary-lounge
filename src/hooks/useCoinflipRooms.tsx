import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CoinflipRoom {
  id: string;
  creator_wallet: string;
  opponent_wallet: string | null;
  bet_amount: number;
  creator_side: "heads" | "tails";
  opponent_side: "heads" | "tails" | null;
  winner_wallet: string | null;
  result: "heads" | "tails" | null;
  status: "waiting" | "playing" | "finished";
  created_at: string;
}

export const useCoinflipRooms = (walletAddress: string | null) => {
  const [rooms, setRooms] = useState<CoinflipRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
    subscribeToRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from("coinflip_rooms")
        .select("*")
        .eq("status", "waiting")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRooms((data || []) as CoinflipRoom[]);
    } catch (error: any) {
      toast.error("Erro ao carregar salas", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToRooms = () => {
    const channel = supabase
      .channel("coinflip_rooms_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "coinflip_rooms"
        },
        () => {
          fetchRooms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const createRoom = async (betAmount: number, side: "heads" | "tails") => {
    if (!walletAddress) {
      toast.error("Conecte sua carteira primeiro!");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("coinflip_rooms")
        .insert({
          creator_wallet: walletAddress,
          bet_amount: betAmount,
          creator_side: side,
          status: "waiting"
        })
        .select()
        .single();

      if (error) throw error;
      toast.success("Sala criada! Aguardando oponente...");
      return data;
    } catch (error: any) {
      toast.error("Erro ao criar sala", {
        description: error.message
      });
      return null;
    }
  };

  const joinRoom = async (roomId: string) => {
    if (!walletAddress) {
      toast.error("Conecte sua carteira primeiro!");
      return false;
    }

    try {
      const { data: room } = await supabase
        .from("coinflip_rooms")
        .select("*")
        .eq("id", roomId)
        .single();

      if (!room) throw new Error("Sala não encontrada");

      const opponentSide = room.creator_side === "heads" ? "tails" : "heads";

      const { error } = await supabase
        .from("coinflip_rooms")
        .update({
          opponent_wallet: walletAddress,
          opponent_side: opponentSide,
          status: "playing",
          started_at: new Date().toISOString()
        })
        .eq("id", roomId);

      if (error) throw error;

      // Simular resultado após 3 segundos
      setTimeout(async () => {
        const result: "heads" | "tails" = Math.random() > 0.5 ? "heads" : "tails";
        const winner = result === room.creator_side ? room.creator_wallet : walletAddress;

        await supabase
          .from("coinflip_rooms")
          .update({
            result,
            winner_wallet: winner,
            status: "finished",
            finished_at: new Date().toISOString()
          })
          .eq("id", roomId);

        // Salvar no histórico
        await supabase.from("coinflip_history").insert([
          {
            room_id: roomId,
            player_wallet: room.creator_wallet,
            bet_amount: room.bet_amount,
            chosen_side: room.creator_side,
            result,
            won: winner === room.creator_wallet,
            payout: winner === room.creator_wallet ? room.bet_amount * 2 : 0
          },
          {
            room_id: roomId,
            player_wallet: walletAddress,
            bet_amount: room.bet_amount,
            chosen_side: opponentSide,
            result,
            won: winner === walletAddress,
            payout: winner === walletAddress ? room.bet_amount * 2 : 0
          }
        ]);
      }, 3000);

      return true;
    } catch (error: any) {
      toast.error("Erro ao entrar na sala", {
        description: error.message
      });
      return false;
    }
  };

  return { rooms, loading, createRoom, joinRoom };
};
