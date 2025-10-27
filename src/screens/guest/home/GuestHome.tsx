import React, { useState } from "react";
import { useGuestAuth } from "../../../contexts/guest";
import { GuestHeader } from "../shared/header";
import { GuestBottomNav } from "../shared/navigation";
import { AnnouncementTicker } from "../shared/announcements";
import { StayDetailsCard } from "../shared/cards";
import { CategoryMenu, type CategoryType } from "../shared/menus";
import {
  HotelCategoryCards,
  ExperiencesCategoryCards,
} from "../shared/category-cards";
import { RecommendedSection } from "../shared/recommended";
import { useAnnouncements } from "../../../hooks/announcements/useAnnouncements";
import {
  useGuestRecommendations,
  useGuestExperienceRecommendations,
} from "../../../hooks/guest-management/recommendations";

interface GuestHomeProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

export const GuestHome: React.FC<GuestHomeProps> = ({
  onNavigate,
  currentPath = "/guest/home",
}) => {
  const { guestSession } = useGuestAuth();
  const { data: announcements, isLoading: announcementsLoading } =
    useAnnouncements(guestSession?.guestData?.hotel_id);

  const { data: recommendations, isLoading: recommendationsLoading } =
    useGuestRecommendations(guestSession?.guestData?.hotel_id, 10);

  const {
    data: experienceRecommendations,
    isLoading: experienceRecommendationsLoading,
  } = useGuestExperienceRecommendations(guestSession?.guestData?.hotel_id, 10);

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>("hotel");

  if (!guestSession) {
    return null;
  }

  const { guestData, hotelData } = guestSession;

  // Format announcements for ticker
  const activeAnnouncements =
    announcements
      ?.filter((a) => a.is_active)
      .map((a) => ({
        id: a.id,
        message: `${a.title} • ${a.description}`,
      })) || [];

  // Handle category selection
  const handleCategoryChange = (category: CategoryType) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky Header + Ticker Container */}
      <div className="sticky top-0 z-50 bg-gray-50">
        {/* Header */}
        <GuestHeader
          guestName={guestData.guest_name}
          hotelName={hotelData.name}
          roomNumber={guestData.room_number}
          guestId={guestData.id}
          dndStatus={guestData.dnd_status}
        />

        {/* Announcements Ticker */}
        {!announcementsLoading && activeAnnouncements.length > 0 && (
          <AnnouncementTicker announcements={activeAnnouncements} />
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Stay Details Card */}
        <StayDetailsCard
          checkInDate="2025-08-29"
          checkOutDate="2025-10-30"
          roomNumber={guestData.room_number}
          accessCode="998218"
        />

        {/* Category Menu */}
        <CategoryMenu onCategoryChange={handleCategoryChange} />

        {/* Category Cards - Dynamic based on selected category */}
        <div className="mb-6">
          {selectedCategory === "hotel" && (
            <HotelCategoryCards onNavigate={onNavigate} />
          )}
          {selectedCategory === "experiences" && (
            <ExperiencesCategoryCards onNavigate={onNavigate} />
          )}
        </div>

        {/* Recommended Section - Dynamic based on selected category */}
        {selectedCategory === "hotel" &&
          !recommendationsLoading &&
          recommendations?.all && (
            <RecommendedSection
              title="Recommended"
              subtitle="Curated selections from our hotel services"
              items={recommendations.all}
              onItemClick={(item) => {
                console.log("Clicked recommendation:", item);
                // Navigate based on category
                if (item.category === "Product Shop") {
                  onNavigate?.("/guest/shop");
                } else if (item.category === "Restaurant") {
                  onNavigate?.("/guest/restaurant");
                } else if (item.category === "Amenity") {
                  onNavigate?.("/guest/amenities");
                }
              }}
            />
          )}

        {selectedCategory === "experiences" &&
          !experienceRecommendationsLoading &&
          experienceRecommendations &&
          experienceRecommendations.length > 0 && (
            <RecommendedSection
              title="Recommended"
              subtitle="Curated places recommended by our hotel"
              items={experienceRecommendations}
              showPrice={false}
              onItemClick={(item) => {
                console.log("Clicked experience recommendation:", item);
                // Navigate to places page or show details
                onNavigate?.("/guest/places");
              }}
            />
          )}

        {/* Main Content */}
        <main className="pb-20 px-4 py-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Home</h2>
          {/* Add your home page content here */}
        </main>
      </div>

      {/* Bottom Navigation */}
      <GuestBottomNav currentPath={currentPath} onNavigate={onNavigate} />
    </div>
  );
};
