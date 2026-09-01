"use client";

import { Building2, MapPin } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

import { POPULAR_CITIES } from "../constants/popularCities";

import type {
  LocationData,
  PopularCity,
} from "../types/location.types";

interface PopularCitiesProps {
  onSelect: (location: LocationData) => void;
  className?: string;
}

export function PopularCities({
  onSelect,
  className,
}: PopularCitiesProps) {
  const handleSelect = (city: PopularCity) => {
    const location: LocationData = {
      locality: "",

      city: city.name,

      state: city.state,

      country: city.country,

      countryCode: "IN",

      postalCode: "",

      formatted: `${city.name}, ${city.state}, ${city.country}`,

      coordinates: {
        latitude: 0,
        longitude: 0,
      },
    };

    onSelect(location);
  };

  return (
    <section className={cn("space-y-4", className)}>
      {/* Header */}

      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-teal-600" />

        <h3 className="text-sm font-semibold text-slate-900">
          Popular Cities
        </h3>
      </div>

      {/* Cities */}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {POPULAR_CITIES.map((city) => (
          <Button
            key={city.id}
            type="button"
            variant="outline"
            onClick={() => handleSelect(city)}
            className={cn(
              "group h-auto justify-start rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-300",
              "hover:-translate-y-1 hover:border-teal-300 hover:bg-teal-50 hover:shadow-md"
            )}
          >
            <MapPin className="mr-3 h-5 w-5 shrink-0 text-teal-600 transition-transform duration-300 group-hover:scale-110" />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {city.name}
              </p>

              <p className="truncate text-xs text-slate-500">
                {city.state}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </section>
  );
}