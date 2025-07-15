'use client';

import { useEffect, useState, useMemo, Fragment } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { MovieCard } from '@/components/movies/MovieCard';
import { MovieFilters } from '@/components/movies/MovieFilters';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAppStore } from '@/lib/store';
import { mockContent } from '@/lib/mock-data';
import { Content } from '@/lib/types';
import { AdUnit } from '@/components/ads/AdUnit';
import { useTranslation } from '@/lib/i18n/context';
import { Footer } from '@/components/layout/Footer';

export default function MoviesPage() {
  const [allMovies, setAllMovies] = useState<Content[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  
  const { user } = useAuth();
  const { currentProfile } = useAppStore();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!currentProfile) {
      router.push('/profiles');
      return;
    }

    // Load all movies from mock data
    const movies = mockContent.filter(item => item.type === 'movie');
    setAllMovies(movies);
  }, [user, currentProfile, router]);

  // Get unique values for filters
  const { availableGenres, availableYears, availableRatings } = useMemo(() => {
    const genres = new Set<string>();
    const years = new Set<string>();
    const ratings = new Set<string>();

    allMovies.forEach(movie => {
      movie.genre.forEach(g => genres.add(g));
      years.add(movie.releaseYear.toString());
      ratings.add(movie.rating);
    });

    return {
      availableGenres: Array.from(genres).sort(),
      availableYears: Array.from(years).sort((a, b) => parseInt(b) - parseInt(a)),
      availableRatings: Array.from(ratings).sort()
    };
  }, [allMovies]);

  // Filter and sort movies
  const filteredAndSortedMovies = useMemo(() => {
    let filtered = allMovies.filter(movie => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          movie.title.toLowerCase().includes(searchLower) ||
          movie.description.toLowerCase().includes(searchLower) ||
          movie.cast.some(actor => actor.toLowerCase().includes(searchLower)) ||
          movie.genre.some(genre => genre.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Genre filter
      if (selectedGenres.length > 0) {
        const hasSelectedGenre = selectedGenres.some(genre => 
          movie.genre.includes(genre)
        );
        if (!hasSelectedGenre) return false;
      }

      // Year filter
      if (selectedYear !== 'all') {
        if (movie.releaseYear.toString() !== selectedYear) return false;
      }

      // Rating filter
      if (selectedRating !== 'all') {
        if (movie.rating !== selectedRating) return false;
      }

      return true;
    });

    // Sort movies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'year':
          return b.releaseYear - a.releaseYear;
        case 'year-desc':
          return a.releaseYear - b.releaseYear;
        case 'duration':
          return a.duration - b.duration;
        case 'duration-desc':
          return b.duration - a.duration;
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [allMovies, searchTerm, selectedGenres, selectedYear, selectedRating, sortBy]);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedGenres([]);
    setSelectedYear('all');
    setSelectedRating('all');
    setSortBy('title');
  };

  if (!user || !currentProfile) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-20 px-4 md:px-8 lg:px-16 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">{t('movies.title')}</h1>
            <p className="text-gray-400">
              {t('movies.description', { count: allMovies.length.toString() })}
            </p>
          </div>

          {/* Ad Banner */}
          <div className="mb-8">
            <AdUnit type="banner" className="max-w-4xl mx-auto" />
          </div>

          {/* Filters */}
          <div className="mb-8">
            <MovieFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedGenres={selectedGenres}
              onGenreToggle={handleGenreToggle}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              selectedRating={selectedRating}
              onRatingChange={setSelectedRating}
              sortBy={sortBy}
              onSortChange={setSortBy}
              availableGenres={availableGenres}
              availableYears={availableYears}
              availableRatings={availableRatings}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-400">
              {t('movies.showing', { 
                filtered: filteredAndSortedMovies.length.toString(), 
                total: allMovies.length.toString() 
              })}
              {searchTerm && (
                <span> {t('movies.searchFor', { term: searchTerm })}</span>
              )}
            </p>
          </div>

          {/* Movies Grid */}
          {filteredAndSortedMovies.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedMovies.map((movie, index) => (
                  <React.Fragment key={movie.id}>
                    <MovieCard movie={movie} />
                    {/* Insert ad after every 8 movies */}
                    {(index + 1) % 8 === 0 && index < filteredAndSortedMovies.length - 1 && (
                      <div className="col-span-full my-6 flex justify-center">
                        <AdUnit type="rectangle" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 text-lg mb-4">
                {searchTerm || selectedGenres.length > 0 || selectedYear !== 'all' || selectedRating !== 'all'
                  ? t('movies.noMoviesFound')
                  : t('movies.noMoviesAvailable')
                }
              </div>
              {(searchTerm || selectedGenres.length > 0 || selectedYear !== 'all' || selectedRating !== 'all') && (
                <button
                  onClick={handleClearFilters}
                  className="text-red-500 hover:text-red-400 underline"
                >
                  {t('movies.clearFilters')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}