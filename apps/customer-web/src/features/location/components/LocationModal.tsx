'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

import { CurrentLocationCard } from './CurrentLocationCard';
import { LocationSearch } from './LocationSearch';
import { PermissionBanner } from './PermissionBanner';
import { PopularCities } from './PopularCities';
import { RecentLocations } from './RecentLocations';
import { SavedAddresses } from './SavedAddresses';
import { LocationSkeleton } from './LocationSkeleton';

import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useRecentLocations } from '../hooks/useRecentLocations';
import {
  deleteRecentLocation,
  getRecentLocations,
} from '../lib/storage';

import { useSavedLocations } from '../hooks/useSavedLocations';

import type { LocationData, RecentLocation, SavedLocation } from '../types/location.types';

interface LocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  /**
   * Fires whenever a location is selected.
   * Parent can update header/cart/etc.
   */
  onLocationSelect?: (location: LocationData) => void;
}

export function LocationModal({ open, onOpenChange, onLocationSelect }: LocationModalProps) {
  const { location, loading, permission, refreshLocation } = useCurrentLocation();

  const {
    recentLocations,
    addRecentLocation,
  } = useRecentLocations();

  const [recentList, setRecentList] =
    useState(recentLocations);

  useEffect(() => {
    setRecentList(recentLocations);
  }, [recentLocations]);

  const { savedLocations } = useSavedLocations();

  const handleLocationSelected = (location: LocationData) => {
    addRecentLocation(location);

    onLocationSelect?.(location);

    onOpenChange(false);
  };

  const handleCurrentLocation = async () => {
    await refreshLocation();

    if (location) {
      handleLocationSelected(location);
    }
  };

  const handleRecentLocation = (recent: RecentLocation) => {
    handleLocationSelected(recent.location);
  };

  const handleSavedLocation = (saved: SavedLocation) => {
    handleLocationSelected(saved.location);
  };

  const handleDeleteRecentLocation = (
    id: string
  ) => {
    const updated = deleteRecentLocation(id);

    setRecentList(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        'overflow-hidden border-0 p-0 shadow-2xl',
        // Mobile view: fixed to the bottom, rounded top corners, max height constraint
        'absolute inset-x-0 bottom-0 w-full max-h-[85vh] rounded-t-3xl rounded-b-none',
        // Desktop view (`sm` and up): centered dialog box with full rounded corners
        'sm:static sm:max-w-xl sm:rounded-3xl sm:max-h-[85vh]',
        'flex flex-col transform transition-transform duration-300 ease-out'
      )}>
        {/* Header */}
        <DialogHeader
          className={cn(
            'border-b border-slate-200',
            'bg-gradient-to-r from-teal-50 via-white to-emerald-50',
            'px-4 sm:px-6 py-5 sm:py-6',
            'flex-shrink-0'
          )}
        >
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900">
              Choose Delivery Location
            </DialogTitle>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className={cn('rounded-full p-2 transition-colors', 'hover:bg-slate-100')}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Select your location to check product availability and delivery options.
          </p>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 p-4 sm:p-6">
          {loading ? (
            <LocationSkeleton />
          ) : (
            <>
              <PermissionBanner permission={permission} onRetry={refreshLocation} />

              <CurrentLocationCard
                location={location}
                loading={loading}
                onUseCurrentLocation={handleCurrentLocation}
              />

              <LocationSearch onSelect={handleLocationSelected} />

              <PopularCities onSelect={handleLocationSelected} />

              <RecentLocations
                locations={recentList}
                onSelect={handleRecentLocation}
                onDelete={handleDeleteRecentLocation}
              />
              <SavedAddresses addresses={savedLocations} onSelect={handleSavedLocation} />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}