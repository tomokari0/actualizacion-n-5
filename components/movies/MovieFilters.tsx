'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

interface MovieFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedGenres: string[];
  onGenreToggle: (genre: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  selectedRating: string;
  onRatingChange: (rating: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  availableGenres: string[];
  availableYears: string[];
  availableRatings: string[];
  onClearFilters: () => void;
}

export function MovieFilters({
  searchTerm,
  onSearchChange,
  selectedGenres,
  onGenreToggle,
  selectedYear,
  onYearChange,
  selectedRating,
  onRatingChange,
  sortBy,
  onSortChange,
  availableGenres,
  availableYears,
  availableRatings,
  onClearFilters
}: MovieFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation();

  const hasActiveFilters = selectedGenres.length > 0 || selectedYear !== 'all' || selectedRating !== 'all';

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t('movies.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="border-gray-600 text-white hover:bg-gray-800"
        >
          <Filter className="w-4 h-4 mr-2" />
          {t('movies.filters')}
          {hasActiveFilters && (
            <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
              {selectedGenres.length + (selectedYear !== 'all' ? 1 : 0) + (selectedRating !== 'all' ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="bg-gray-900 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">{t('movies.filters')}</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4 mr-1" />
                {t('common.clear')} {t('common.all')}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Sort By */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">{t('movies.sortBy')}</label>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="title">{t('movies.sortOptions.title')}</SelectItem>
                  <SelectItem value="title-desc">{t('movies.sortOptions.titleDesc')}</SelectItem>
                  <SelectItem value="year">{t('movies.sortOptions.year')}</SelectItem>
                  <SelectItem value="year-desc">{t('movies.sortOptions.yearDesc')}</SelectItem>
                  <SelectItem value="duration">{t('movies.sortOptions.duration')}</SelectItem>
                  <SelectItem value="duration-desc">{t('movies.sortOptions.durationDesc')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">{t('movies.releaseYear')}</label>
              <Select value={selectedYear} onValueChange={onYearChange}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all">{t('movies.allYears')}</SelectItem>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">{t('movies.rating')}</label>
              <Select value={selectedRating} onValueChange={onRatingChange}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all">{t('movies.allRatings')}</SelectItem>
                  {availableRatings.map((rating) => (
                    <SelectItem key={rating} value={rating}>
                      {rating}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Genre Filter */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">{t('movies.genres')}</label>
            <div className="flex flex-wrap gap-2">
              {availableGenres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenres.includes(genre) ? "default" : "outline"}
                  size="sm"
                  onClick={() => onGenreToggle(genre)}
                  className={
                    selectedGenres.includes(genre)
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "border-gray-600 text-white hover:bg-gray-800"
                  }
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedGenres.map((genre) => (
            <Badge
              key={genre}
              variant="secondary"
              className="bg-red-600/20 text-red-400 hover:bg-red-600/30"
            >
              {genre}
              <button
                onClick={() => onGenreToggle(genre)}
                className="ml-1 hover:text-red-300"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {selectedYear !== 'all' && (
            <Badge
              variant="secondary"
              className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
            >
              {selectedYear}
              <button
                onClick={() => onYearChange('all')}
                className="ml-1 hover:text-blue-300"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedRating !== 'all' && (
            <Badge
              variant="secondary"
              className="bg-green-600/20 text-green-400 hover:bg-green-600/30"
            >
              {selectedRating}
              <button
                onClick={() => onRatingChange('all')}
                className="ml-1 hover:text-green-300"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}