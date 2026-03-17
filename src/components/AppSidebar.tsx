import { useState } from "react";
import { Home, Search, Library, ListMusic, Heart, Menu, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { usePlayerStore } from "@/store/playerStore";

export function AppSidebar() {
  const library = usePlayerStore((s) => s.library);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  const navItems = [
    { icon: Home, label: "Home", to: "/" },
    { icon: Search, label: "Search", to: "/search" },
    { icon: ListMusic, label: "Queue", to: "/queue" },
  ];

  return (
    <aside className="hidden md:flex w-64 shrink-0 h-full flex-col gap-2 p-2">
      {/* Navigation */}
      <nav className="bg-surface rounded-lg p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Library */}
      <div className="bg-surface rounded-lg p-4 flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Library className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-semibold text-muted-foreground">Your Library</span>
        </div>

        {library.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <Heart className="h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              Save songs to your library by clicking the heart icon
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-1">
            {library.map((track) => (
              <button
                key={track.id}
                onClick={() => usePlayerStore.getState().setTrack(track)}
                className={`w-full flex items-center gap-3 p-2 rounded-md transition-all duration-150 hover:bg-elevated text-left ${
                  currentTrack?.id === track.id ? "bg-elevated" : ""
                }`}
              >
                <img
                  src={track.thumbnail}
                  alt={track.title}
                  className="h-10 w-10 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm truncate ${
                    currentTrack?.id === track.id ? "text-primary" : "text-foreground"
                  }`}>
                    {track.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                </div>
                {currentTrack?.id === track.id && isPlaying && (
                  <div className="h-3 w-3 rounded-full bg-primary animate-pulse-glow" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

/** Mobile bottom navigation bar */
export function MobileNav() {
  const location = useLocation();
  const navItems = [
    { icon: Home, label: "Home", to: "/" },
    { icon: Search, label: "Search", to: "/search" },
    { icon: Library, label: "Library", to: "/queue" },
  ];

  return (
    <nav className="md:hidden flex items-center justify-around bg-surface border-t border-border py-2">
      {navItems.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 text-[10px] font-medium transition-colors duration-150 ${
              isActive ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
