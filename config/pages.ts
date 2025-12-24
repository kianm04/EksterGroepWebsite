/**
 * Page Configuration for the Ekster Group Website
 *
 * Defines all pages in the page-based navigation system.
 * Each page specifies its 3D model, camera settings, content, and transitions.
 *
 * To add a new page:
 * 1. Add a PageConfig object to the PAGES array
 * 2. Set the order property to the desired position
 * 3. Optionally create a custom content component in components/pages/
 */

import type { PageConfig, AdjacentPages } from "~/types/pages";

/**
 * All pages in navigation order
 */
export const PAGES: PageConfig[] = [
  {
    id: "intro",
    name: "Introduction",
    order: 0,
    modelId: "ok10b",
    camera: {
      radius: 20,
      theta: 0,
      phi: Math.PI / 4,
      yOffset: -3,
    },
    transition: {
      duration: 800,
      easing: "easeInOut",
      fadeUI: true,
      uiFadeDuration: 200,
      type: "zoom",
    },
    content: {
      position: "left",
      visibleDuringTransition: false,
      staticContent: {
        title: "De Ekstergroep",
        body: [
          "De Ekstergroep doet beheer, exploitatie, renovatie en verbetering van zowel monumentaal als gewoon vastgoed.",
          "Wij leggen de focus op esthetiek, waarbij degelijkheid en levensduur als vereisten worden meegenomen.",
          "Als hecht team pakken we jaarlijks een aantal totalrenovaties op, waarbij we de cliënt van begin tot eind begeleiden. Samen met architect en constructeur zetten we dromen op papier en voeren we alles naar planning uit.",
        ],
        ctaText: "info@ekstergroep.nl",
        ctaHref: "mailto:info@ekstergroep.nl",
      },
    },
    meta: {
      title: "Ekstergroep - Renovatie & Vastgoed",
      description:
        "De Ekstergroep doet beheer, exploitatie, renovatie en verbetering van zowel monumentaal als gewoon vastgoed.",
    },
    navigable: true,
  },
  {
    id: "craftsmanship",
    name: "Craftsmanship",
    order: 1,
    modelId: "ok10b",
    camera: {
      radius: 15,
      theta: Math.PI / 4,
      phi: Math.PI / 3,
      yOffset: -5,
    },
    transition: {
      duration: 1000,
      easing: "easeInOut",
      fadeUI: true,
      uiFadeDuration: 200,
      type: "orbit",
    },
    content: {
      position: "left",
      visibleDuringTransition: false,
      staticContent: {
        title: "Discover Our Craftsmanship",
        body: [
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
          "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
        ],
      },
    },
    meta: {
      title: "Craftsmanship - Ekstergroep",
      description:
        "Discover our architectural craftsmanship and attention to detail.",
    },
    navigable: true,
  },
  {
    id: "house2",
    name: "Second Project",
    order: 2,
    modelId: "br62b",
    camera: {
      radius: 35,
      theta: Math.PI / 5,
      phi: Math.PI / 3,
      yOffset: 2,
    },
    transition: {
      duration: 1200,
      easing: "easeInOut",
      fadeUI: true,
      uiFadeDuration: 300,
      type: "zoom",
    },
    content: {
      position: "right",
      visibleDuringTransition: false,
      staticContent: {
        title: "Another Vision",
        subtitle: "Our Second Architectural Project",
        body: [
          "A different perspective on modern living, this project showcases our versatility in architectural design.",
          "Each project we undertake receives the same level of dedication and attention to detail.",
        ],
      },
    },
    meta: {
      title: "Second Project - Ekstergroep",
      description: "Another architectural vision from Ekstergroep.",
    },
    navigable: true,
  },
];

/**
 * Get a page by its ID
 */
export function getPageById(id: string): PageConfig | undefined {
  return PAGES.find((page) => page.id === id);
}

/**
 * Get a page by its order index
 */
export function getPageByOrder(order: number): PageConfig | undefined {
  return PAGES.find((page) => page.order === order);
}

/**
 * Get the first page (order 0)
 */
export function getFirstPage(): PageConfig | undefined {
  return getPageByOrder(0);
}

/**
 * Get the last page
 */
export function getLastPage(): PageConfig | undefined {
  const maxOrder = Math.max(...PAGES.map((p) => p.order));
  return getPageByOrder(maxOrder);
}

/**
 * Get adjacent pages (previous and next) for a given page
 */
export function getAdjacentPages(currentId: string): AdjacentPages {
  const current = getPageById(currentId);
  if (!current) {
    return { prev: null, next: null };
  }

  return {
    prev: PAGES.find((p) => p.order === current.order - 1) ?? null,
    next: PAGES.find((p) => p.order === current.order + 1) ?? null,
  };
}

/**
 * Get all navigable pages (for jump navigation)
 */
export function getNavigablePages(): PageConfig[] {
  return PAGES.filter((page) => page.navigable !== false);
}

/**
 * Get total page count
 */
export function getPageCount(): number {
  return PAGES.length;
}

/**
 * Check if a page exists by ID
 */
export function pageExists(id: string): boolean {
  return PAGES.some((page) => page.id === id);
}

/**
 * Get all page IDs in order
 */
export function getPageIds(): string[] {
  return PAGES.slice()
    .sort((a, b) => a.order - b.order)
    .map((page) => page.id);
}
