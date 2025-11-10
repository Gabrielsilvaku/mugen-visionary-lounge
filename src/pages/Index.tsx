import { Header } from "@/components/Header";
import { CoinflipGame } from "@/components/CoinflipGame";
import { JackpotGame } from "@/components/JackpotGame";
import { WeeklyRaffle } from "@/components/WeeklyRaffle";
import { LiveChat } from "@/components/LiveChat";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <CoinflipGame />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <JackpotGame />
              <WeeklyRaffle />
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <LiveChat />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
