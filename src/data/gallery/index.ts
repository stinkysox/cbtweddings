import { WEDDING_GALLERY } from "./wedding";
import { ENGAGEMENT_GALLERY } from "./engagement";
import { FAMILY_GALLERY } from "./family";
import { PRE_WEDDING_GALLERY } from "./preWedding";
import { RITUALS_GALLERY } from "./rituals";
import { OTHER_EVENTS_GALLERY } from "./otherEvents";

export const GALLERY_DATA = [
  ...WEDDING_GALLERY,
  ...PRE_WEDDING_GALLERY,
  ...ENGAGEMENT_GALLERY,
  ...RITUALS_GALLERY,
  ...FAMILY_GALLERY,
  ...OTHER_EVENTS_GALLERY,
];

export * from "./wedding";
export * from "./engagement";
export * from "./family";
export * from "./preWedding";
export * from "./rituals";
export * from "./otherEvents";
