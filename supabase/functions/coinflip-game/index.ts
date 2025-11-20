import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { roomId, action, betAmount, chosenSide } = await req.json();

    if (action === 'create') {
      // Validate bet amount
      if (!betAmount || betAmount < 0.1 || betAmount > 10) {
        throw new Error('Invalid bet amount. Must be between 0.1 and 10.');
      }

      // Get user's wallet address
      const { data: profile } = await supabaseClient
        .from('user_profiles')
        .select('wallet_address')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        throw new Error('User profile not found');
      }

      // Create room
      const { data: room, error: roomError } = await supabaseClient
        .from('coinflip_rooms')
        .insert({
          creator_wallet: profile.wallet_address,
          bet_amount: betAmount,
          creator_side: chosenSide,
          status: 'waiting'
        })
        .select()
        .single();

      if (roomError) throw roomError;

      return new Response(JSON.stringify({ room }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'join') {
      // Get user's wallet address
      const { data: profile } = await supabaseClient
        .from('user_profiles')
        .select('wallet_address')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        throw new Error('User profile not found');
      }

      // Get room details
      const { data: room } = await supabaseClient
        .from('coinflip_rooms')
        .select('*')
        .eq('id', roomId)
        .eq('status', 'waiting')
        .single();

      if (!room) {
        throw new Error('Room not found or already in progress');
      }

      if (room.creator_wallet === profile.wallet_address) {
        throw new Error('Cannot join your own room');
      }

      // Determine opponent side
      const opponentSide = room.creator_side === 'heads' ? 'tails' : 'heads';

      // Generate random result (server-side)
      const result = Math.random() < 0.5 ? 'heads' : 'tails';
      const winner = result === room.creator_side ? room.creator_wallet : profile.wallet_address;
      const loser = winner === room.creator_wallet ? profile.wallet_address : room.creator_wallet;

      // Update room
      const { error: updateError } = await supabaseClient
        .from('coinflip_rooms')
        .update({
          opponent_wallet: profile.wallet_address,
          opponent_side: opponentSide,
          status: 'completed',
          result: result,
          winner_wallet: winner,
          started_at: new Date().toISOString(),
          finished_at: new Date().toISOString()
        })
        .eq('id', roomId);

      if (updateError) throw updateError;

      // Record history for both players
      const payout = room.bet_amount * 2;
      
      await supabaseClient.from('coinflip_history').insert([
        {
          player_wallet: room.creator_wallet,
          room_id: roomId,
          bet_amount: room.bet_amount,
          chosen_side: room.creator_side,
          result: result,
          won: winner === room.creator_wallet,
          payout: winner === room.creator_wallet ? payout : 0
        },
        {
          player_wallet: profile.wallet_address,
          room_id: roomId,
          bet_amount: room.bet_amount,
          chosen_side: opponentSide,
          result: result,
          won: winner === profile.wallet_address,
          payout: winner === profile.wallet_address ? payout : 0
        }
      ]);

      // Update user profiles
      if (winner === room.creator_wallet) {
        await supabaseClient.rpc('increment_profile_stats', {
          p_wallet: room.creator_wallet,
          p_won: payout,
          p_spent: room.bet_amount
        });
        await supabaseClient.rpc('increment_profile_stats', {
          p_wallet: profile.wallet_address,
          p_won: 0,
          p_spent: room.bet_amount
        });
      } else {
        await supabaseClient.rpc('increment_profile_stats', {
          p_wallet: profile.wallet_address,
          p_won: payout,
          p_spent: room.bet_amount
        });
        await supabaseClient.rpc('increment_profile_stats', {
          p_wallet: room.creator_wallet,
          p_won: 0,
          p_spent: room.bet_amount
        });
      }

      return new Response(JSON.stringify({ 
        result,
        winner,
        payout: winner === profile.wallet_address ? payout : 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error in coinflip-game function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
