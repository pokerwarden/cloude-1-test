import { useEffect, useState } from "react";
import { continueRender, delayRender } from "remotion";
import { searchPhotos, UnsplashPhoto } from "../utils/unsplash";

/**
 * Hook to fetch and use Unsplash images in Remotion
 * Handles the delay/continue render cycle for proper video rendering
 */
export const useUnsplashSearch = (
  query: string,
  options: {
    perPage?: number;
    orientation?: "landscape" | "portrait" | "squarish";
  } = {}
) => {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [handle] = useState(() => delayRender("Loading Unsplash images"));

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const result = await searchPhotos(query, {
          perPage: options.perPage || 5,
          orientation: options.orientation || "landscape",
        });
        setPhotos(result.results);
        setLoading(false);
        continueRender(handle);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch images");
        setLoading(false);
        continueRender(handle);
      }
    };

    fetchPhotos();
  }, [query, options.perPage, options.orientation, handle]);

  return { photos, loading, error };
};

/**
 * Hook to preload a single Unsplash image
 */
export const useUnsplashImage = (imageUrl: string) => {
  const [loaded, setLoaded] = useState(false);
  const [handle] = useState(() => delayRender("Loading image: " + imageUrl));

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setLoaded(true);
      continueRender(handle);
    };
    img.onerror = () => {
      setLoaded(true);
      continueRender(handle);
    };
    img.src = imageUrl;
  }, [imageUrl, handle]);

  return loaded;
};
