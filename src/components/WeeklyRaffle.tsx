import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Clock } from "lucide-react";

export const WeeklyRaffle = () => {
  return (
    <Card className="bg-card-glass border-2 border-primary/30 p-6 shadow-neon-cyan">
      <div className="flex items-center gap-3 mb-6">
        <Ticket className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Weekly Raffle</h2>
      </div>

      <div className="text-center mb-6">
        <div className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          $2,000
        </div>
        <p className="text-muted-foreground">Prize Pool</p>
      </div>

      <div className="bg-background/30 border border-primary/20 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Time Remaining</span>
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Clock className="h-4 w-4" />
            <span>3d 12h 45m</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">1,247</p>
            <p className="text-sm text-muted-foreground">Tickets Sold</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">328</p>
            <p className="text-sm text-muted-foreground">Participants</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="bg-background/30 border border-primary/20 rounded-lg p-3 flex items-center justify-between">
          <span className="text-foreground">1 Ticket</span>
          <span className="text-primary font-semibold">0.1 SOL</span>
        </div>
        <div className="bg-background/30 border border-primary/20 rounded-lg p-3 flex items-center justify-between">
          <span className="text-foreground">10 Tickets</span>
          <span className="text-primary font-semibold">0.9 SOL</span>
        </div>
        <div className="bg-background/30 border border-secondary/20 rounded-lg p-3 flex items-center justify-between">
          <span className="text-foreground">25 Tickets (Best Value)</span>
          <span className="text-secondary font-semibold">2.0 SOL</span>
        </div>
      </div>

      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon-cyan font-semibold">
        Buy Tickets
      </Button>
    </Card>
  );
};
