import { GalleryItem } from "@/types";

import familyPortrait01 from "@/assets/family-photography/cbt-family-portrait-01.webp";
import familyPortrait02 from "@/assets/family-photography/cbt-family-portrait-02.webp";
import familyPortrait03 from "@/assets/family-photography/cbt-family-portrait-03.webp";
import familyMoments01 from "@/assets/family-photography/cbt-family-moments-01.webp";
import familyMoments02 from "@/assets/family-photography/cbt-family-moments-02.webp";
import familyMoments03 from "@/assets/family-photography/cbt-family-moments-03.webp";
import familyCandid01 from "@/assets/family-photography/cbt-family-candid-01.webp";
import familyEditorial01 from "@/assets/family-photography/cbt-family-editorial-01.webp";
import familyEditorial02 from "@/assets/family-photography/cbt-family-editorial-02.webp";

export const FAMILY_GALLERY: GalleryItem[] = [
  {
    id: "f1",
    category: "Family",
    imageUrl: familyPortrait01.src,
    title: "Generations Together",
    description: "A portrait of love passed through the ages.",
  },
  {
    id: "f2",
    category: "Family",
    imageUrl: familyPortrait02.src,
    title: "Roots & Wings",
    description: "The foundation of every great love story.",
  },
  {
    id: "f3",
    category: "Family",
    imageUrl: familyPortrait03.src,
    title: "Bonds That Last",
    description: "Unbreakable connections captured with grace.",
  },
  {
    id: "f4",
    category: "Family",
    imageUrl: familyMoments01.src,
    title: "Warmth of Home",
    description: "Where laughter echoes and memories are born.",
  },
  {
    id: "f5",
    category: "Family",
    imageUrl: familyMoments02.src,
    title: "Circle of Love",
    description: "Family — the first and forever embrace.",
  },
  {
    id: "f6",
    category: "Family",
    imageUrl: familyMoments03.src,
    title: "Treasured Togetherness",
    description: "Moments that make a house a home.",
  },
  {
    id: "f7",
    category: "Family",
    imageUrl: familyCandid01.src,
    title: "Unscripted Joy",
    description: "Real smiles, real love, real family.",
  },
  {
    id: "f8",
    category: "Family",
    imageUrl: familyEditorial01.src,
    title: "Heritage & Heart",
    description: "A visual ode to family and tradition.",
  },
  {
    id: "f9",
    category: "Family",
    imageUrl: familyEditorial02.src,
    title: "Kindred Spirits",
    description: "Where belonging becomes a beautiful frame.",
  },
];
