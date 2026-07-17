import { GalleryItem } from "@/types";

import preWeddingShoot01 from "@/assets/pre-wedding-photography/cbt-pre-wedding-shoot-01.webp";
import preWeddingShoot02 from "@/assets/pre-wedding-photography/cbt-pre-wedding-shoot-02.webp";
import preWeddingShoot03 from "@/assets/pre-wedding-photography/cbt-pre-wedding-shoot-03.webp";
import preWeddingShoot04 from "@/assets/pre-wedding-photography/cbt-pre-wedding-shoot-04.webp";
import preWeddingPortrait01 from "@/assets/pre-wedding-photography/cbt-pre-wedding-portrait-01.webp";
import preWeddingPortrait02 from "@/assets/pre-wedding-photography/cbt-pre-wedding-portrait-02.webp";
import preWeddingCandid01 from "@/assets/pre-wedding-photography/cbt-pre-wedding-candid-01.webp";
import preWeddingCandid02 from "@/assets/pre-wedding-photography/cbt-pre-wedding-candid-02.webp";

export const PRE_WEDDING_GALLERY: GalleryItem[] = [
  {
    id: "pw1",
    category: "Pre-Wedding",
    imageUrl: preWeddingShoot01.src,
    title: "Before the Forever",
    description: "A quiet promise shared before the wedding day.",
  },
  {
    id: "pw2",
    category: "Pre-Wedding",
    imageUrl: preWeddingShoot02.src,
    title: "Love in Motion",
    description: "Captured laughter and candid romance.",
  },
  {
    id: "pw3",
    category: "Pre-Wedding",
    imageUrl: preWeddingShoot03.src,
    title: "Stolen Glances",
    description: "Moments where words were never needed.",
  },
  {
    id: "pw4",
    category: "Pre-Wedding",
    imageUrl: preWeddingShoot04.src,
    title: "Written in Us",
    description: "A story of love unfolding naturally.",
  },
  {
    id: "pw5",
    category: "Pre-Wedding",
    imageUrl: preWeddingPortrait01.src,
    title: "Unscripted Love",
    description: "Pure emotions captured effortlessly.",
  },
  {
    id: "pw6",
    category: "Pre-Wedding",
    imageUrl: preWeddingPortrait02.src,
    title: "Golden Hour Promise",
    description: "Soft light, softer feelings.",
  },
  {
    id: "pw7",
    category: "Pre-Wedding",
    imageUrl: preWeddingCandid01.src,
    title: "Together, Always",
    description: "Two souls aligned in perfect harmony.",
  },
  {
    id: "pw8",
    category: "Pre-Wedding",
    imageUrl: preWeddingCandid02.src,
    title: "A Quiet Kind of Love",
    description: "Intimate moments before the celebration.",
  },
];
