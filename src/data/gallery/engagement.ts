import { GalleryItem } from "@/types";

import engagementSession01 from "@/assets/engagement-photography/cbt-engagement-session-01.webp";
import engagementSession02 from "@/assets/engagement-photography/cbt-engagement-session-02.webp";
import engagementSession03 from "@/assets/engagement-photography/cbt-engagement-session-03.webp";
import engagementPortrait01 from "@/assets/engagement-photography/cbt-engagement-portrait-01.webp";
import engagementPortrait02 from "@/assets/engagement-photography/cbt-engagement-portrait-02.webp";
import engagementCandid01 from "@/assets/engagement-photography/cbt-engagement-candid-01.webp";
import engagementCandid02 from "@/assets/engagement-photography/cbt-engagement-candid-02.webp";

export const ENGAGEMENT_GALLERY: GalleryItem[] = [
  {
    id: "e1",
    category: "Engagement",
    imageUrl: engagementSession01.src,
    title: "The Ring & The Promise",
    description: "A moment where forever was quietly decided.",
  },
  {
    id: "e2",
    category: "Engagement",
    imageUrl: engagementSession02.src,
    title: "She Said Yes",
    description: "A celebration of love sealed with joy.",
  },
  {
    id: "e3",
    category: "Engagement",
    imageUrl: engagementSession03.src,
    title: "A New Chapter",
    description: "Where excitement meets heartfelt emotion.",
  },
  {
    id: "e4",
    category: "Engagement",
    imageUrl: engagementPortrait01.src,
    title: "Forever Starts Today",
    description: "An unforgettable beginning to a lifelong story.",
  },
  {
    id: "e5",
    category: "Engagement",
    imageUrl: engagementPortrait02.src,
    title: "Captured in Love",
    description: "Soft smiles and unspoken promises.",
  },
  {
    id: "e6",
    category: "Engagement",
    imageUrl: engagementCandid01.src,
    title: "Just Us Two",
    description: "An intimate moment away from the world.",
  },
  {
    id: "e7",
    category: "Engagement",
    imageUrl: engagementCandid02.src,
    title: "A Promise in Gold",
    description: "Love captured in its most radiant form.",
  },
];
