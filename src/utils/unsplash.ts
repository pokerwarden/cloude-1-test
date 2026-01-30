// Unsplash API utility for fetching images
const UNSPLASH_ACCESS_KEY = "SZnms6ywByeZ_HfgUlBJKZmf_GhjBM1GBsNF6wVn614";
const UNSPLASH_API_URL = "https://api.unsplash.com";

export interface UnsplashPhoto {
  id: string;
  width: number;
  height: number;
  color: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
  };
}

export interface UnsplashSearchResult {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

/**
 * Search for photos on Unsplash
 * @param query - Search term
 * @param options - Search options
 * @returns Promise with search results
 */
export const searchPhotos = async (
  query: string,
  options: {
    page?: number;
    perPage?: number;
    orientation?: "landscape" | "portrait" | "squarish";
  } = {}
): Promise<UnsplashSearchResult> => {
  const { page = 1, perPage = 10, orientation = "landscape" } = options;

  const params = new URLSearchParams({
    query,
    page: page.toString(),
    per_page: perPage.toString(),
    orientation,
  });

  const response = await fetch(
    `${UNSPLASH_API_URL}/search/photos?${params}`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Unsplash API error: ${response.status}`);
  }

  return response.json();
};

/**
 * Get a random photo from Unsplash
 * @param query - Optional search term to filter random photos
 * @returns Promise with a random photo
 */
export const getRandomPhoto = async (
  query?: string,
  orientation: "landscape" | "portrait" | "squarish" = "landscape"
): Promise<UnsplashPhoto> => {
  const params = new URLSearchParams({ orientation });
  if (query) {
    params.set("query", query);
  }

  const response = await fetch(
    `${UNSPLASH_API_URL}/photos/random?${params}`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Unsplash API error: ${response.status}`);
  }

  return response.json();
};

/**
 * Get a specific photo by ID
 * @param id - Photo ID
 * @returns Promise with the photo
 */
export const getPhoto = async (id: string): Promise<UnsplashPhoto> => {
  const response = await fetch(`${UNSPLASH_API_URL}/photos/${id}`, {
    headers: {
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Unsplash API error: ${response.status}`);
  }

  return response.json();
};

/**
 * Pre-defined image collections for common use cases
 * These return direct URLs that can be used immediately
 */
export const getUnsplashUrl = (
  photoId: string,
  width: number = 1920,
  height: number = 1080
): string => {
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&auto=format`;
};
