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

// Animated text component
const AnimatedText: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - delay;

  const opacity = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const y = interpolate(localFrame, [0, 20], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  return (
    <div style={{ opacity, transform: `translateY(${y}px)`, ...style }}>
      {children}
    </div>
  );
};

// Image with zoom effect
const ZoomImage: React.FC<{
  src: string;
  zoomDirection?: "in" | "out";
}> = ({ src, zoomDirection = "in" }) => {
  const frame = useCurrentFrame();

  const scale = zoomDirection === "in"
    ? interpolate(frame, [0, 180], [1, 1.2], { extrapolateRight: "clamp" })
    : interpolate(frame, [0, 180], [1.2, 1], { extrapolateRight: "clamp" });

  return (
    <Img
      src={src}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: `scale(${scale})`,
      }}
    />
  );
};

// Main Shoes Video Component
export const ShoesVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Fetch only 3 images to stay within rate limits
  const { photos, loading, error } = useUnsplashSearch("sneakers shoes fashion", {
    perPage: 3,
    orientation: "landscape",
  });

  // Loading state
  if (loading) {
    return (
      <AbsoluteFill
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ color: "#fff", fontSize: 48, fontFamily: "Arial" }}>
          Loading...
        </div>
      </AbsoluteFill>
    );
  }

  // Error state - show fallback video
  if (error || photos.length === 0) {
    return (
      <AbsoluteFill
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <AnimatedText>
          <div style={{ fontSize: 150, marginBottom: 20 }}>👟</div>
        </AnimatedText>
        <AnimatedText delay={20}>
          <h1 style={{ color: "#fff", fontSize: 80, margin: 0 }}>
            STEP INTO STYLE
          </h1>
        </AnimatedText>
        <AnimatedText delay={40}>
          <p style={{ color: "#00d4ff", fontSize: 36, letterSpacing: 5 }}>
            NEW COLLECTION 2026
          </p>
        </AnimatedText>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Scene 1: Intro with first shoe image */}
      <Sequence from={0} durationInFrames={180}>
        <AbsoluteFill>
          <ZoomImage src={photos[0]?.urls.regular} zoomDirection="in" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 100,
              top: "50%",
              transform: "translateY(-50%)",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <AnimatedText>
              <h1 style={{ color: "#fff", fontSize: 100, margin: 0, fontWeight: "bold" }}>
                STEP
              </h1>
            </AnimatedText>
            <AnimatedText delay={15}>
              <h1 style={{ color: "#fff", fontSize: 100, margin: 0, fontWeight: "bold" }}>
                INTO
              </h1>
            </AnimatedText>
            <AnimatedText delay={30}>
              <h1 style={{ color: "#00d4ff", fontSize: 100, margin: 0, fontWeight: "bold" }}>
                STYLE
              </h1>
            </AnimatedText>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: Second image with features */}
      <Sequence from={180} durationInFrames={180}>
        <AbsoluteFill>
          <ZoomImage src={photos[1]?.urls.regular || photos[0]?.urls.regular} zoomDirection="out" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: "Arial, sans-serif",
              textAlign: "center",
            }}
          >
            <AnimatedText>
              <h2 style={{ color: "#fff", fontSize: 48, margin: 0, letterSpacing: 10 }}>
                FEATURING
              </h2>
            </AnimatedText>
            <AnimatedText delay={30} style={{ marginTop: 50 }}>
              <div style={{ color: "#00d4ff", fontSize: 36 }}>✓ Premium Comfort</div>
            </AnimatedText>
            <AnimatedText delay={50} style={{ marginTop: 20 }}>
              <div style={{ color: "#00d4ff", fontSize: 36 }}>✓ Lightweight Design</div>
            </AnimatedText>
            <AnimatedText delay={70} style={{ marginTop: 20 }}>
              <div style={{ color: "#00d4ff", fontSize: 36 }}>✓ Sustainable Materials</div>
            </AnimatedText>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 3: Third image with CTA */}
      <Sequence from={360} durationInFrames={180}>
        <AbsoluteFill>
          <ZoomImage src={photos[2]?.urls.regular || photos[0]?.urls.regular} zoomDirection="in" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 150,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <AnimatedText>
              <h1 style={{ color: "#fff", fontSize: 72, margin: 0 }}>
                NEW COLLECTION
              </h1>
            </AnimatedText>
            <AnimatedText delay={20}>
              <p style={{ color: "#888", fontSize: 32, margin: "20px 0 40px" }}>
                Available Now
              </p>
            </AnimatedText>
            <AnimatedText delay={40}>
              <div
                style={{
                  display: "inline-block",
                  background: "linear-gradient(90deg, #00d4ff, #7b2ff7)",
                  padding: "20px 60px",
                  borderRadius: 50,
                  fontSize: 32,
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                SHOP NOW
              </div>
            </AnimatedText>
          </div>
          {/* Photo credit */}
          <div
            style={{
              position: "absolute",
              bottom: 20,
              right: 30,
              color: "rgba(255,255,255,0.5)",
              fontSize: 14,
              fontFamily: "Arial",
            }}
          >
            Photos from Unsplash
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
