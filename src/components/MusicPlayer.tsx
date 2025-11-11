import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(20);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      setVolume(0);
    } else {
      setVolume(20);
    }
  };

  return (
    <>
      <audio ref={audioRef} loop>
        <source src="/casino-music.mp3" type="audio/mpeg" />
      </audio>

      <div className="fixed bottom-6 left-6 z-50">
        <div className="flex items-end gap-3">
          {showControls && (
            <Card className="bg-card-glass border-2 border-primary/40 p-4 shadow-neon-cyan animate-fade-in relative">
              <Button
                onClick={() => setShowControls(false)}
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 bg-transparent border border-primary text-primary hover:bg-primary/10"
              >
                <X size={14} />
              </Button>
              <div className="flex items-center gap-4 min-w-[200px]">
                <Button
                  onClick={toggleMute}
                  size="icon"
                  className="bg-transparent border-2 border-primary text-primary hover:bg-primary/10 shadow-neon-cyan"
                >
                  {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </Button>
                <Slider
                  value={[volume]}
                  onValueChange={(val) => setVolume(val[0])}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-primary font-bold text-sm min-w-[35px]">
                  {volume}%
                </span>
              </div>
            </Card>
          )}

          <Button
            onClick={() => {
              if (!showControls) {
                setShowControls(true);
              } else {
                togglePlay();
              }
            }}
            onMouseEnter={() => setShowControls(true)}
            size="icon"
            className="bg-transparent border-2 border-primary text-primary hover:bg-primary/10 shadow-neon-cyan hover:shadow-intense transition-all w-14 h-14"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </Button>
        </div>
      </div>
    </>
  );
};
