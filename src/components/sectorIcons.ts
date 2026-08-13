import type { ReactElement } from "react";
import {
  Gym,
  Keys,
  Medical,
  Office,
  Restaurant,
  Retail,
  School,
  Strata,
  Warehouse,
} from "./Icons";
import type { CommercialSector } from "@/lib/site";

type Glyph = (props: { size?: number; className?: string }) => ReactElement;

/**
 * Sector key → glyph.
 *
 * Shared by the /commercial page and the home page's commercial band, which both
 * render the same nine sectors and would otherwise each keep their own copy of
 * this map. It cannot live in lib/site.ts: that file is the data layer and holds
 * no components.
 *
 * Keying off `CommercialSector["icon"]` means a typo in the data — or a new
 * sector added without a glyph — fails the build rather than rendering a card
 * with a hole in it.
 */
export const SECTOR_ICONS: Record<CommercialSector["icon"], Glyph> = {
  office: Office,
  medical: Medical,
  school: School,
  retail: Retail,
  warehouse: Warehouse,
  hospitality: Restaurant,
  gym: Gym,
  strata: Strata,
  keys: Keys,
};
