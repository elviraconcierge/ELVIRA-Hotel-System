import React, { useState } from "react";
import { useGuestAuth } from "../../../contexts/guest";
import { GuestPageLayout } from "../shared/layout";
import { SearchFilterBar } from "../shared/search-filter";
import { MenuCategorySection } from "../shared/cards/menu-item";
import { useAnnouncements } from "../../../hooks/announcements/useAnnouncements";

interface GuestRestaurantProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

export const GuestRestaurant: React.FC<GuestRestaurantProps> = ({
  onNavigate,
  currentPath = "/guest/restaurant",
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

  // Sample menu data - Replace with actual API data
  const appetizers = [
    {
      id: "1",
      title: "Bruschetta al Pomodoro",
      description:
        "Toasted ciabatta bread topped with fresh tomatoes, garlic, basil, and extra virgin olive oil.",
      price: 9.0,
      imageUrl:
        "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=200",
    },
    {
      id: "2",
      title: "Süßkartoffel-Ingwer-Suppe",
      description:
        "A velvety sweet potato and ginger soup, topped with toasted pumpkin seeds and a swirl of coconut cream.",
      price: 8.0,
      imageUrl:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200",
    },
    {
      id: "3",
      title: "Carpaccio di Manzo",
      description:
        "Thinly sliced raw beef fillet, drizzled with truffle oil, topped with arugula, shaved Parmesan, and capers.",
      price: 16.0,
      imageUrl:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=200",
    },
  ];

  const mainCourses = [
    {
      id: "4",
      title: "Vitello Tonnato",
      description:
        "Classic Piedmontese dish of cold, sliced veal covered with a creamy, mayonnaise-like sauce flavored with tuna.",
      price: 17.5,
      imageUrl:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200",
    },
    {
      id: "5",
      title: "Gegrillte Avocado",
      description:
        "Grilled avocado halves filled with a quinoa-corn salsa and drizzled with a cilantro-lime dressing.",
      price: 10.5,
      imageUrl:
        "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=200",
    },
  ];

  const handleAddItem = (itemId: string) => {
    console.log("Add item:", itemId);
    // Handle add to cart
  };

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
          placeholder="Search menu..."
        />
      }
    >
      {/* Menu Categories */}
      <MenuCategorySection
        categoryName="Appetizers"
        items={appetizers}
        onAddClick={handleAddItem}
      />

      <MenuCategorySection
        categoryName="Main Courses"
        items={mainCourses}
        onAddClick={handleAddItem}
      />
    </GuestPageLayout>
  );
};
