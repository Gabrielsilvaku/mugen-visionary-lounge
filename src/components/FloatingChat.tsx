import { MessageCircle, X, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { user: "Sistema", text: "Bem-vindo ao chat!", time: "agora" },
  ]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { user: "Você", text: message, time: "agora" }]);
      setMessage("");
    }
  };

  return (
    <>
      {/* Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-primary shadow-intense flex items-center justify-center hover:scale-110 transition-transform z-50 animate-glow-pulse"
        >
          <MessageCircle className="h-7 w-7 text-background" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-card border-2 border-primary/40 rounded-lg shadow-intense z-50 flex flex-col animate-fade-in">
          <div className="flex items-center justify-between p-3 border-b border-primary/20">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="font-bold text-foreground">Chat ao Vivo</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, idx) => (
              <div key={idx} className="animate-fade-in">
                <div className="flex items-baseline gap-2">
                  <span className="text-primary font-semibold text-xs">{msg.user}</span>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
                <p className="text-foreground text-sm">{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-primary/20 flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Digite..."
              className="bg-background/50 border-primary/20 text-foreground text-sm"
            />
            <Button
              onClick={handleSend}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
