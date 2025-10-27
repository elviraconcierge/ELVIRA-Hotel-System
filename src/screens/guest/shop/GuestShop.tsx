import React, { useState } from "react";
import { useGuestAuth } from "../../../contexts/guest";
import { GuestPageLayout } from "../shared/layout";
import { SearchFilterBar } from "../shared/search-filter";
import { useAnnouncements } from "../../../hooks/announcements/useAnnouncements";

interface GuestShopProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

export const GuestShop: React.FC<GuestShopProps> = ({
  onNavigate,
  currentPath = "/guest/shop",
}) => {
  const { guestSession } = useGuestAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: announcements } = useAnnouncements(
    guestSession?.guestData?.hotel_id
  );

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

  return (
    <GuestPageLayout
      guestName={guestData.guest_name}
      hotelName={hotelData.name}
      roomNumber={guestData.room_number}
      guestId={guestData.id}
      dndStatus={guestData.dnd_status}
      announcements={activeAnnouncements}
      currentPath={currentPath}
      onNavigate={onNavigate}
      headerSlot={
        <SearchFilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={() => {
            // Handle filter click
            console.log("Filter clicked");
          }}
          placeholder="Search products..."
        />
      }
    >
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Guest Shop</h2>
        {/* Add your shop content here */}
      </div>
    </GuestPageLayout>
  );
};
