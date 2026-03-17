import { useState, useMemo } from "react";
import { Search as SearchIcon } from "lucide-react";
import { motion } from "framer-motion";
import { TrackCard } from "@/components/TrackCard";
import { moodCategories } from "@/data/sampleTracks";
import type { Track } from "@/store/playerStore";

const allTracks: Track[] = moodCategories.flatMap(c => c.tracks);

const SearchPage = () => {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allTracks.filter(
      t => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="p-4 md:p-6">
      <div className="relative mb-8 max-w-lg">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to listen to?"
          className="w-full h-12 pl-12 pr-4 bg-foreground/10 rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-150"
          autoFocus
        />
      </div>

      {query.trim() ? (
        results.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.02 } } }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {results.map((track, i) => (
              <TrackCard key={track.id} track={track} index={i} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">No results found for "{query}"</p>
            <p className="text-sm text-muted-foreground/60 mt-2">Try searching for something else</p>
          </div>
        )
      ) : (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Browse all</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {moodCategories.map((cat) => (
              <button
                key={cat.title}
                onClick={() => setQuery(cat.title.split(" ")[0])}
                className={`relative h-40 rounded-lg bg-gradient-to-br ${cat.color} p-4 overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-transform duration-150`}
              >
                <span className="text-xl font-bold text-foreground">{cat.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
