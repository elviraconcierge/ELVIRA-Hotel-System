/**
 * Guest Experience Recommendations Hook
 *
 * Fetches hotel-recommended third-party places for experiences
 */

import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { supabase } from "../../../services/supabase";
import type { RecommendedItem } from "../../../screens/guest/shared/recommended";

/**
 * Fetch recommended third-party places for experiences
 * Returns places that are both approved AND recommended by the hotel
 */
export function useGuestExperienceRecommendations(
  hotelId: string | undefined,
  limit: number = 10
) {
  return useOptimizedQuery<RecommendedItem[]>({
    queryKey: ["guest-experience-recommendations", hotelId, limit],
    queryFn: async () => {
      if (!hotelId) {
        return [];
      }

      // Fetch approved and recommended places from hotel_thirdparty_places
      const { data, error } = await supabase
        .from("hotel_thirdparty_places")
        .select(
          `
          *,
          thirdparty_place:thirdparty_places (*)
        `
        )
        .eq("hotel_id", hotelId)
        .eq("hotel_approved", true)
        .eq("hotel_recommended", true);

      if (error) throw error;

      if (!data || data.length === 0) {
        return [];
      }

      // Transform to RecommendedItem format
      const items: RecommendedItem[] = data
        .filter((item) => item.thirdparty_place) // Ensure place data exists
        .map((item) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const place = item.thirdparty_place as any;

          // Get any available photo - check multiple fields
          const photoUrl =
            place.photo_url ||
            place.photos?.[0]?.url ||
            place.icon ||
            undefined;

          return {
            id: place.id,
            title: place.name || "Unknown",
            description: place.description || place.address || "",
            imageUrl: photoUrl,
            category: place.category || "Experience",
          };
        })
        // Randomize the order
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);

      return items;
    },
    enabled: !!hotelId,
    config: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,
    },
  });
}
