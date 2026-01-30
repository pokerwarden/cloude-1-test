import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const HelloWorld: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scale = interpolate(frame, [0, 30], [0.5, 1], {
    extrapolateRight: "clamp",
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
          opacity,
          transform: `scale(${scale})`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 100,
            fontWeight: "bold",
            color: "#eee",
            fontFamily: "sans-serif",
            margin: 0,
          }}
        >
          Hello World!
        </h1>
        <p
          style={{
            fontSize: 40,
            color: "#888",
            fontFamily: "sans-serif",
            marginTop: 20,
          }}
        >
          Welcome to Remotion
        </p>
      </div>
    </AbsoluteFill>
  );
};
