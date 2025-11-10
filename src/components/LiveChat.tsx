import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Bell, Send } from "lucide-react";
import { useState } from "react";

export const LiveChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, user: "CryptoKing", text: "Just won big on coinflip! 🎉", time: "2m ago" },
    { id: 2, user: "SolMaster", text: "gg! What were the odds?", time: "1m ago" },
    { id: 3, user: "MoonBoy", text: "Anyone want to join jackpot?", time: "30s ago" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [hasNewMessages, setHasNewMessages] = useState(true);

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        user: "You",
        text: newMessage,
        time: "now"
      }]);
      setNewMessage("");
    }
  };

  return (
    <Card className="bg-card-glass border-2 border-primary/30 p-4 shadow-neon-cyan h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-foreground">Live Chat</h3>
          {hasNewMessages && (
            <div className="w-2 h-2 rounded-full bg-secondary animate-glow-pulse" />
          )}
        </div>
        <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-primary">
          <Bell className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="animate-fade-in">
            <div className="flex items-baseline gap-2">
              <span className="text-primary font-semibold text-sm">{msg.user}</span>
              <span className="text-xs text-muted-foreground">{msg.time}</span>
            </div>
            <p className="text-foreground text-sm">{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="bg-background/50 border-primary/20 text-foreground"
        />
        <Button 
          onClick={handleSend}
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
