import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
  Sequence,
} from "remotion";

const Feature: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - delay;

  const opacity = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateX = interpolate(localFrame, [0, 20], [-50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        fontSize: 36,
        color: "#ffffff",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        gap: 15,
      }}
    >
      <span style={{ color: "#00d4ff" }}>✓</span>
      {text}
    </div>
  );
};

export const NewShoes: React.FC = () => {
  const frame = useCurrentFrame();

  // Background gradient animation
  const gradientPosition = interpolate(frame, [0, 600], [0, 100], {
    extrapolateRight: "clamp",
  });

  // Main title animation (frames 0-40)
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleScale = interpolate(frame, [0, 30], [0.8, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  // Shoe emoji bounce animation
  const shoeScale = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(2)),
  });
  const shoeRotate = interpolate(frame, [30, 60], [-15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  // Subtitle animation
  const subtitleOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // CTA animation (last 3 seconds)
  const ctaOpacity = interpolate(frame, [480, 510], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaScale = interpolate(frame, [480, 520], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });
  const ctaPulse = interpolate(
    frame % 30,
    [0, 15, 30],
    [1, 1.05, 1],
    {}
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${135 + gradientPosition * 0.5}deg, #0f0f1a 0%, #1a1a2e 50%, #2d1f3d 100%)`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)",
          top: -100,
          right: -100,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,107,107,0.1) 0%, transparent 70%)",
          bottom: -50,
          left: -50,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        {/* Shoe emoji */}
        <div
          style={{
            fontSize: 150,
            marginBottom: 20,
            transform: `scale(${shoeScale}) rotate(${shoeRotate}deg)`,
          }}
        >
          👟
        </div>

        {/* Main Title */}
        <h1
          style={{
            fontSize: 100,
            fontWeight: "bold",
            color: "#ffffff",
            margin: 0,
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            textShadow: "0 0 40px rgba(0,212,255,0.5)",
          }}
        >
          NEW SHOES
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 40,
            color: "#00d4ff",
            margin: "20px 0 50px 0",
            opacity: subtitleOpacity,
            letterSpacing: 8,
          }}
        >
          COLLECTION 2026
        </p>

        {/* Features list */}
        <Sequence from={90}>
          <div style={{ textAlign: "left" }}>
            <Feature text="Ultra Lightweight Design" delay={0} />
            <Feature text="Premium Materials" delay={30} />
            <Feature text="Maximum Comfort" delay={60} />
            <Feature text="Eco-Friendly Production" delay={90} />
          </div>
        </Sequence>

        {/* CTA */}
        <div
          style={{
            marginTop: 60,
            opacity: ctaOpacity,
            transform: `scale(${ctaScale * ctaPulse})`,
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg, #00d4ff, #7b2ff7)",
              padding: "20px 60px",
              borderRadius: 50,
              fontSize: 36,
              fontWeight: "bold",
              color: "#ffffff",
              boxShadow: "0 10px 40px rgba(0,212,255,0.4)",
            }}
          >
            SHOP NOW
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
