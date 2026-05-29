import { useEffect, useMemo, useRef, useState } from "react";
import "./dlavie-music-player.css";

type Track = {
  title: string;
  src: string;
};

const tracks: Track[] = [
  { title: "Music 1", src: "/audio/music-1.mp3" },
  { title: "Music 2", src: "/audio/music-2.mp3" },
  { title: "Music 3", src: "/audio/music-3.mp3" },
  { title: "Music 4", src: "/audio/music-4.mp3" },
];

export default function DlavieMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMissing, setIsMissing] = useState(false);
  const currentTrack = useMemo(() => tracks[trackIndex], [trackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsMissing(false);
    audio.volume = 0.42;
    audio.src = currentTrack.src;
    audio.load();

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrack, isPlaying]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        return;
      }
      await audio.play();
      setIsPlaying(true);
      setIsMissing(false);
    } catch {
      setIsPlaying(false);
      setIsMissing(true);
    }
  };

  const next = () => {
    setTrackIndex((index) => (index + 1) % tracks.length);
  };

  return (
    <aside className="dlavie-music" aria-label="Dlavie portfolio music player">
      <audio
        ref={audioRef}
        preload="metadata"
        loop
        onError={() => {
          setIsMissing(true);
          setIsPlaying(false);
        }}
      />
      <button className={isPlaying ? "is-playing" : ""} type="button" onClick={toggle} aria-label={isPlaying ? "Pause music" : "Play music"}>
        <span />
      </button>
      <div className="dlavie-music-copy">
        <strong>{isPlaying ? "Now Playing" : "Music"}</strong>
        <small>{isMissing ? "File not found" : currentTrack.title}</small>
      </div>
      <button className="dlavie-music-next" type="button" onClick={next} aria-label="Next music track">
        Next
      </button>
    </aside>
  );
}
