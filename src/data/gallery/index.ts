import { WEDDING_GALLERY } from "./wedding";
import { ENGAGEMENT_GALLERY } from "./engagement";
import { FAMILY_GALLERY } from "./family";
import { PRE_WEDDING_GALLERY } from "./preWedding";
import { RITUALS_GALLERY } from "./rituals";
import { OTHER_EVENTS_GALLERY } from "./otherEvents";
import { LOCAL_GALLERY } from "./local.generated";
import type { GalleryCategory, GalleryItem } from "@/types";

function createGalleryItems(
  category: GalleryCategory,
  idPrefix: string,
  imageUrls: string[],
): GalleryItem[] {
  return imageUrls.map((imageUrl, index) => ({
    id: `${idPrefix}${index + 1}`,
    category,
    imageUrl,
  }));
}

export const GALLERY_DATA = [
  ...createGalleryItems("Wedding", "w", WEDDING_GALLERY),
  ...createGalleryItems("Pre-Wedding", "p", PRE_WEDDING_GALLERY),
  ...createGalleryItems("Engagement", "e", ENGAGEMENT_GALLERY),
  ...createGalleryItems("Rituals", "r", RITUALS_GALLERY),
  ...createGalleryItems("Family", "f", FAMILY_GALLERY),
  ...createGalleryItems("Other Events", "o", OTHER_EVENTS_GALLERY),
  ...LOCAL_GALLERY,
];

export * from "./wedding";
export * from "./engagement";
export * from "./family";
export * from "./preWedding";
export * from "./rituals";
export * from "./otherEvents";
