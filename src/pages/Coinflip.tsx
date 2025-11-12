import { Header } from "@/components/Header";
import { FloatingChat } from "@/components/FloatingChat";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import coinHeads from "@/assets/coin-heads.png";
import coinTails from "@/assets/coin-tails.png";
import Ably from "ably/promises";

const ABLY_API_KEY = "COLOQUE_SUA_CHAVE_ABLY_AQUI"; // você cria grátis no https://www.ably.com

const Coinflip = () => {
  const [betAmount, setBetAmount] = useState("0,1");
  const [selectedSide, setSelectedSide] = useState<"heads" | "tails" | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [opponentSide, setOpponentSide] = useState<"heads" | "tails" | null>(null);
  const [roomId, setRoomId] = useState("");
  const [ablyClient, setAblyClient] = useState<any>(null);
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    if (!roomId) return;
    const client = new Ably.Realtime.Promise({ key: ABLY_API_KEY });
    setAblyClient(client);
    const ch = client.channels.get(roomId);
    setChannel(ch);

    // Receber o lado do adversário
    ch.subscribe("playerSide", (msg: any) => {
      setOpponentSide(msg.data);
    });

    // Receber resultado final
    ch.subscribe("result", (msg: any) => {
      setResult(msg.data);
      setIsFlipping(false);
      if (msg.data === selectedSide) {
        toast.success("🎉 Você ganhou!", {
          description: `Ganhou ${parseFloat(betAmount.replace(",", ".")) * 2} SOL`,
        });
      } else {
        toast.error("😔 Você perdeu", {
          description: `Perdeu ${betAmount} SOL`,
        });
      }
    });

    return () => {
      ch.unsubscribe();
      client.close();
    };
  }, [roomId, selectedSide, betAmount]);

  const handleFlip = async () => {
    if (!selectedSide || !channel) return;

    setIsFlipping(true);
    setResult(null);

    // Envia seu lado pro outro jogador
    await channel.publish("playerSide", selectedSide);

    // Se não houver adversário em 3s, joga contra bot
    setTimeout(async () => {
      if (!opponentSide) {
        const botSide = Math.random() > 0.5 ? "heads" : "tails";
        setOpponentSide(botSide);

        const flipResult = Math.random() > 0.5 ? "heads" : "tails";
        await channel.publish("result", flipResult);
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FloatingChat />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-foreground mb-3 tracking-wider">COINFLIP 1v1</h1>
          <p className="text-xl text-primary">Escolha um lado e desafie outro jogador ou o bot</p>
        </div>

        {!roomId && (
          <div className="flex flex-col items-center mb-8 gap-4">
            <Input
              placeholder="Digite um Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="max-w-xs text-center"
            />
            <Button
              onClick={() => setRoomId(roomId)}
              className="bg-gradient-to-r from-primary to-secondary text-white py-2 px-6"
            >
              Entrar na Sala
            </Button>
          </div>
        )}

        {(isFlipping || result) && (
          <div className="flex flex-col items-center mb-8">
            <img
              src={result === "heads" ? coinHeads : coinTails}
              alt="Coin"
              className={`w-32 h-32 ${isFlipping ? "animate-spin-slow" : ""}`}
            />
            {result && !isFlipping && (
              <div
                className={`mt-4 text-2xl font-bold ${
                  result === selectedSide ? "text-green-500" : "text-red-500"
                }`}
