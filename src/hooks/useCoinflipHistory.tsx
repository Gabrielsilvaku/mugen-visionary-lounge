import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CoinflipHistoryItem {
  id: string;
  player_wallet: string;
  bet_amount: number;
  chosen_side: "heads" | "tails";
  result: "heads" | "tails";
  won: boolean;
  payout: number;
  created_at: string;
}

export const useCoinflipHistory = (walletAddress: string | null) => {
  const [history, setHistory] = useState<CoinflipHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (walletAddress) {
      fetchHistory();
    }
  }, [walletAddress]);

  const fetchHistory = async () => {
    if (!walletAddress) return;

    try {
      const { data, error } = await supabase
        .from("coinflip_history")
        .select("*")
        .eq("player_wallet", walletAddress)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory((data || []) as CoinflipHistoryItem[]);
    } catch (error: any) {
      toast.error("Erro ao carregar histórico", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return { history, loading, refetch: fetchHistory };
};
