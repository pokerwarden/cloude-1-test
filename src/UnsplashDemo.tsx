import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  Easing,
  Sequence,
} from "remotion";
import { useUnsplashSearch } from "./hooks/useUnsplash";

// Text overlay component
const TextOverlay: React.FC<{
  title: string;
  subtitle?: string;
  position?: "center" | "bottom";
}> = ({ title, subtitle, position = "center" }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [0, 20], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: position === "bottom" ? 100 : "auto",
        top: position === "center" ? "50%" : "auto",
        transform: position === "center" ? "translateY(-50%)" : "none",
        textAlign: "center",
        opacity,
        padding: 40,
      }}
    >
      <h1
        style={{
          fontSize: 72,
          fontWeight: "bold",
          color: "#fff",
          textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          margin: 0,
          transform: `translateY(${translateY}px)`,
          fontFamily: "Arial, sans-serif",
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: 32,
            color: "#fff",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            marginTop: 20,
            fontFamily: "Arial, sans-serif",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

// Image slide component with Ken Burns effect
const ImageSlide: React.FC<{
  imageUrl: string;
  photographer: string;
}> = ({ imageUrl, photographer }) => {
  const frame = useCurrentFrame();

  // Ken Burns zoom effect
  const scale = interpolate(frame, [0, 150], [1, 1.15], {
    extrapolateRight: "clamp",
  });

  // Fade in/out
  const opacity = interpolate(
    frame,
    [0, 20, 130, 150],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      <Img
        src={imageUrl}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
      {/* Dark overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      {/* Photographer credit */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 30,
          color: "rgba(255,255,255,0.7)",
          fontSize: 16,
          fontFamily: "Arial, sans-serif",
        }}
      >
        Photo by {photographer} on Unsplash
      </div>
    </AbsoluteFill>
  );
};

// Main Unsplash Demo Component
export const UnsplashDemo: React.FC = () => {
  const frame = useCurrentFrame();

  // Fetch images from Unsplash
  const { photos, loading, error } = useUnsplashSearch("nature landscape", {
    perPage: 5,
    orientation: "landscape",
  });

  if (loading) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#1a1a2e",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ color: "#fff", fontSize: 36 }}>Loading images...</div>
      </AbsoluteFill>
    );
  }

  if (error || photos.length === 0) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#1a1a2e",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ color: "#e74c3c", fontSize: 36 }}>
          {error || "No images found"}
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Intro */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill
          style={{
            backgroundColor: "#1a1a2e",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextOverlay
            title="Unsplash Integration"
            subtitle="Beautiful stock photos in your Remotion videos"
          />
        </AbsoluteFill>
      </Sequence>

      {/* Image slides */}
      {photos.slice(0, 5).map((photo, index) => (
        <Sequence
          key={photo.id}
          from={90 + index * 150}
          durationInFrames={150}
        >
          <ImageSlide
            imageUrl={photo.urls.regular}
            photographer={photo.user.name}
          />
          <TextOverlay
            title={photo.alt_description || "Beautiful Nature"}
            position="bottom"
          />
        </Sequence>
      ))}

      {/* Outro */}
      <Sequence from={90 + 5 * 150} durationInFrames={90}>
        <AbsoluteFill
          style={{
            backgroundColor: "#1a1a2e",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextOverlay
            title="Powered by Unsplash"
            subtitle="Free high-quality images for your projects"
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
