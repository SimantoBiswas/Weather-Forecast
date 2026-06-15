'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Loader2, History, X } from 'lucide-react';
import type { GeoLocation, RecentSearch } from '@/lib/types';
import { searchLocations } from '@/lib/api';
import { useGeolocation } from '@/hooks/useGeolocation';
import { debounce, cn } from '@/lib/utils';

interface SearchBarProps {
  onSelect: (location: GeoLocation) => void;
  recentSearches: RecentSearch[];
}

export function SearchBar({ onSelect, recentSearches }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { loading: locating, getPosition } = useGeolocation();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced live search against Open-Meteo geocoding API
  useEffect(() => {
    const run = debounce(async (value: string) => {
      if (value.trim().length < 2) {
        setResults([]);
        setSearching(false);
        return;
      }
      try {
        setSearching(true);
        setError(null);
        const locations = await searchLocations(value);
        setResults(locations);
      } catch {
        setError('Could not search for that city.');
      } finally {
        setSearching(false);
      }
    }, 400);

    run(query);
  }, [query]);

  const handleSelect = (location: GeoLocation) => {
    onSelect(location);
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  const handleUseLocation = async () => {
    try {
      const { latitude, longitude } = await getPosition();
      handleSelect({
        name: 'Current Location',
        country: '',
        latitude,
        longitude,
      });
    } catch {
      setError('Unable to access your location.');
    }
  };

  const showRecents = open && query.trim().length === 0 && recentSearches.length > 0;
  const showResults = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div
        className={cn(
          'glass-panel flex items-center gap-2 rounded-2xl px-4 py-3 transition-all duration-300',
          'border-white/10 focus-within:border-accent-violet/50 focus-within:shadow-glow-md'
        )}
      >
        <Search className="h-[18px] w-[18px] shrink-0 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          type="text"
          placeholder="Search for a city or place..."
          aria-label="Search for a city"
          className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="text-slate-400 transition-colors hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <motion.button
          type="button"
          onClick={handleUseLocation}
          whileTap={{ scale: 0.92 }}
          aria-label="Use my current location"
          className="flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] p-2 text-accent-cyan transition-all hover:border-accent-cyan/50 hover:shadow-glow-cyan"
        >
          {locating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {(showResults || showRecents) && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="glass-panel absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-80 overflow-y-auto rounded-2xl p-2"
          >
            {showResults && (
              <>
                {searching && (
                  <div className="flex items-center gap-2 px-3 py-3 text-sm text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin" /> Searching...
                  </div>
                )}
                {!searching && error && (
                  <div className="px-3 py-3 text-sm text-red-400">{error}</div>
                )}
                {!searching && !error && results.length === 0 && (
                  <div className="px-3 py-3 text-sm text-slate-400">
                    No locations found for &ldquo;{query}&rdquo;.
                  </div>
                )}
                {!searching &&
                  results.map((result) => (
                    <button
                      key={`${result.latitude}-${result.longitude}`}
                      onClick={() => handleSelect(result)}
                      className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/10"
                    >
                      <span className="flex flex-col">
                        <span className="font-medium text-white">{result.name}</span>
                        <span className="text-xs text-slate-400">
                          {[result.admin1, result.country].filter(Boolean).join(', ')}
                        </span>
                      </span>
                      <MapPin className="h-4 w-4 text-slate-500" />
                    </button>
                  ))}
              </>
            )}

            {showRecents && (
              <>
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                  <History className="h-3.5 w-3.5" /> Recent searches
                </div>
                {recentSearches.map((result) => (
                  <button
                    key={`${result.latitude}-${result.longitude}`}
                    onClick={() => handleSelect(result)}
                    className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/10"
                  >
                    <span className="flex flex-col">
                      <span className="font-medium text-white">{result.name}</span>
                      <span className="text-xs text-slate-400">{result.country}</span>
                    </span>
                    <History className="h-4 w-4 text-slate-500" />
                  </button>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
