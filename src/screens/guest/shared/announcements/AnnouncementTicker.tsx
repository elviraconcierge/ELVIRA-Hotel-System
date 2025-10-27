import React, { useEffect } from "react";

interface Announcement {
  id: string;
  message: string;
}

interface AnnouncementTickerProps {
  announcements?: Announcement[];
  className?: string;
}

export const AnnouncementTicker: React.FC<AnnouncementTickerProps> = ({
  announcements = [],
  className = "",
}) => {
  useEffect(() => {
    console.log(
      "📢 AnnouncementTicker - Total announcements:",
      announcements.length
    );
    console.log("📢 Announcements data:", announcements);
  }, [announcements]);

  if (announcements.length === 0) {
    console.log("⚠️ No announcements to display");
    return null;
  }

  // Combine all announcements into a single string with separator
  const allAnnouncements = announcements.map((a) => a.message).join("  •  ");

  console.log("✅ Ticker content:", allAnnouncements);

  return (
    <div
      className={`bg-gray-900 text-white py-2.5 overflow-hidden ${className}`}
    >
      <style>
        {`
          @keyframes ticker-scroll {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .ticker-animate {
            animation: ticker-scroll 40s linear infinite;
          }
        `}
      </style>
      <div className="relative flex">
        <div className="flex ticker-animate">
          <span className="text-sm font-medium whitespace-nowrap px-4">
            {allAnnouncements}
          </span>
          <span className="text-sm font-medium whitespace-nowrap px-4">
            {allAnnouncements}
          </span>
        </div>
      </div>
    </div>
  );
};
