import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";

export const HelloWorld: React.FC = () => {
  const frame = useCurrentFrame();

  // Title animation: fade in and slide up from center
  const titleOpacity = interpolate(frame, [0, 40], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  const titleTranslateY = interpolate(frame, [0, 40], [50, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  // Subtitle animation: fade in with slight delay
  const subtitleOpacity = interpolate(frame, [20, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a2e",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Title - Hebrew text */}
        <h1
          style={{
            fontSize: 120,
            fontWeight: "bold",
            color: "#ffffff",
            fontFamily: "Arial, sans-serif",
            margin: 0,
            opacity: titleOpacity,
            transform: `translateY(${titleTranslateY}px)`,
          }}
        >
          ברוכים הבאים
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 48,
            color: "#888888",
            fontFamily: "Arial, sans-serif",
            marginTop: 30,
            opacity: subtitleOpacity,
          }}
        >
          My First Remotion Video
        </p>
      </div>
    </AbsoluteFill>
  );
};
