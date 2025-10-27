import React from "react";
import { useGuestAuth } from "../../../contexts/guest";
import { GuestHeader } from "../shared/header";
import { GuestBottomNav } from "../shared/navigation";
import { AnnouncementTicker } from "../shared/announcements";
import { useAnnouncements } from "../../../hooks/announcements/useAnnouncements";

interface GuestPlacesProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

export const GuestPlaces: React.FC<GuestPlacesProps> = ({
  onNavigate,
  currentPath = "/guest/places",
}) => {
  const { guestSession } = useGuestAuth();
  const { data: announcements, isLoading: announcementsLoading } =
    useAnnouncements(guestSession?.guestData?.hotel_id);

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
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

      {/* Main Content */}
      <main className="flex-1 pb-20 px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Guest Places</h2>
        {/* Add your places content here */}
      </main>

      {/* Bottom Navigation */}
      <GuestBottomNav currentPath={currentPath} onNavigate={onNavigate} />
    </div>
  );
};
