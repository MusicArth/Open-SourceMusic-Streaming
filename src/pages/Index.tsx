import { useEffect } from "react";
import { motion } from "framer-motion";
import { TrackCard } from "@/components/TrackCard";
import { moodCategories, featuredTracks } from "@/data/sampleTracks";
import { usePlayerStore } from "@/store/playerStore";

const Index = () => {
  const loadLibrary = usePlayerStore((s) => s.loadLibrary);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-4 md:p-6 pb-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold tracking-tight text-foreground mb-6"
      >
        {greeting()}
      </motion.h1>

      {/* Featured Quick Play */}
      <section className="mb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {featuredTracks.map((track) => (
            <button
              key={track.id}
              onClick={() => usePlayerStore.getState().setTrack(track)}
              className="group flex items-center gap-4 bg-surface/80 hover:bg-elevated rounded-md overflow-hidden transition-colors duration-150"
            >
              <img src={track.thumbnail} alt={track.title} className="h-16 w-16 object-cover" />
              <span className="text-sm font-semibold text-foreground truncate pr-4">{track.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Mood Categories */}
      {moodCategories.map((category) => (
        <section key={category.title} className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4">{category.title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {category.tracks.map((track, i) => (
              <TrackCard key={track.id} track={track} index={i} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Index;
