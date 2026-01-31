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

// Animated text with glow effect
const GlowText: React.FC<{
  children: React.ReactNode;
  delay?: number;
  fontSize?: number;
  color?: string;
}> = ({ children, delay = 0, fontSize = 72, color = "#00f5ff" }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - delay;

  const opacity = interpolate(localFrame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(localFrame, [0, 25], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  const glowIntensity = interpolate(
    (frame + delay) % 60,
    [0, 30, 60],
    [20, 40, 20]
  );

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        fontSize,
        fontWeight: "bold",
        color,
        textShadow: `0 0 ${glowIntensity}px ${color}, 0 0 ${glowIntensity * 2}px ${color}`,
        fontFamily: "Arial, sans-serif",
      }}
    >
      {children}
    </div>
  );
};

// Particle effect for quantum feel
const QuantumParticles: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((i) => {
        const x = Math.sin(frame * 0.02 + i * 0.5) * 400 + 960;
        const y = Math.cos(frame * 0.015 + i * 0.7) * 300 + 540;
        const opacity = interpolate(
          Math.sin(frame * 0.05 + i),
          [-1, 1],
          [0.1, 0.5]
        );
        const size = 4 + Math.sin(i) * 2;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: "#00f5ff",
              opacity,
              boxShadow: "0 0 10px #00f5ff",
            }}
          />
        );
      })}
    </div>
  );
};

// Qubit visualization
const Qubit: React.FC<{ x: number; y: number; delay: number }> = ({ x, y, delay }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - delay;

  const opacity = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rotation = frame * 2;
  const pulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.8, 1.2]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        transform: `rotate(${rotation}deg) scale(${pulse})`,
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          border: "3px solid #00f5ff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 0 20px #00f5ff, inset 0 0 20px rgba(0,245,255,0.2)",
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: "#00f5ff",
            boxShadow: "0 0 15px #00f5ff",
          }}
        />
      </div>
    </div>
  );
};

// Main Quantum Computer Video
export const QuantumComputer: React.FC = () => {
  const frame = useCurrentFrame();

  // Fetch quantum/technology images (only 3 for rate limits)
  const { photos, loading, error } = useUnsplashSearch("quantum computer technology", {
    perPage: 3,
    orientation: "landscape",
  });

  // Loading state
  if (loading) {
    return (
      <AbsoluteFill
        style={{
          background: "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 100%)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GlowText>Loading...</GlowText>
      </AbsoluteFill>
    );
  }

  const bgImage = photos[0]?.urls.regular;
  const bgImage2 = photos[1]?.urls.regular || bgImage;
  const bgImage3 = photos[2]?.urls.regular || bgImage;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a1a" }}>
      {/* Scene 1: Title intro (0-5s / frames 0-150) */}
      <Sequence from={0} durationInFrames={150}>
        <AbsoluteFill
          style={{
            background: "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%)",
          }}
        >
          <QuantumParticles />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <GlowText delay={0} fontSize={100}>
              QUANTUM
            </GlowText>
            <GlowText delay={20} fontSize={100} color="#a855f7">
              COMPUTING
            </GlowText>
            <div style={{ marginTop: 40 }}>
              <GlowText delay={50} fontSize={32} color="#888">
                The Future of Technology
              </GlowText>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: What is it? (5-10s / frames 150-300) */}
      <Sequence from={150} durationInFrames={150}>
        <AbsoluteFill>
          {bgImage && (
            <Img
              src={bgImage}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${interpolate(frame - 150, [0, 150], [1, 1.1])})`,
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, rgba(10,10,26,0.95) 0%, rgba(10,10,26,0.7) 50%, rgba(10,10,26,0.4) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 100,
              top: "50%",
              transform: "translateY(-50%)",
              maxWidth: 800,
            }}
          >
            <GlowText delay={0} fontSize={56}>
              What is Quantum Computing?
            </GlowText>
            <div style={{ marginTop: 40 }}>
              <GlowText delay={30} fontSize={28} color="#ccc">
                Unlike classical computers using bits (0 or 1),
              </GlowText>
            </div>
            <div style={{ marginTop: 15 }}>
              <GlowText delay={50} fontSize={28} color="#ccc">
                quantum computers use QUBITS that can be
              </GlowText>
            </div>
            <div style={{ marginTop: 15 }}>
              <GlowText delay={70} fontSize={36} color="#00f5ff">
                both 0 AND 1 simultaneously
              </GlowText>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 3: Qubit visualization (10-15s / frames 300-450) */}
      <Sequence from={300} durationInFrames={150}>
        <AbsoluteFill
          style={{
            background: "linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 100%)",
          }}
        >
          <QuantumParticles />
          {/* Qubits */}
          <Qubit x={400} y={300} delay={0} />
          <Qubit x={600} y={200} delay={10} />
          <Qubit x={800} y={350} delay={20} />
          <Qubit x={1000} y={250} delay={30} />
          <Qubit x={1200} y={320} delay={40} />
          <Qubit x={500} y={500} delay={50} />
          <Qubit x={900} y={550} delay={60} />
          <Qubit x={1100} y={480} delay={70} />

          <div
            style={{
              position: "absolute",
              bottom: 150,
              left: 0,
              right: 0,
              textAlign: "center",
            }}
          >
            <GlowText delay={0} fontSize={48}>
              Superposition & Entanglement
            </GlowText>
            <div style={{ marginTop: 20 }}>
              <GlowText delay={30} fontSize={28} color="#a855f7">
                Qubits working together exponentially increase computing power
              </GlowText>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 4: Applications (15-20s / frames 450-600) */}
      <Sequence from={450} durationInFrames={150}>
        <AbsoluteFill>
          {bgImage2 && (
            <Img
              src={bgImage2}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.4,
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(10,10,26,0.8)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <GlowText delay={0} fontSize={56}>
              Applications
            </GlowText>
            <div style={{ display: "flex", gap: 60, marginTop: 60 }}>
              <div style={{ textAlign: "center" }}>
                <GlowText delay={20} fontSize={48}>🔐</GlowText>
                <GlowText delay={30} fontSize={24} color="#ccc">Cryptography</GlowText>
              </div>
              <div style={{ textAlign: "center" }}>
                <GlowText delay={40} fontSize={48}>💊</GlowText>
                <GlowText delay={50} fontSize={24} color="#ccc">Drug Discovery</GlowText>
              </div>
              <div style={{ textAlign: "center" }}>
                <GlowText delay={60} fontSize={48}>🧬</GlowText>
                <GlowText delay={70} fontSize={24} color="#ccc">DNA Analysis</GlowText>
              </div>
              <div style={{ textAlign: "center" }}>
                <GlowText delay={80} fontSize={48}>🤖</GlowText>
                <GlowText delay={90} fontSize={24} color="#ccc">AI & ML</GlowText>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 5: Outro (20-25s / frames 600-750) */}
      <Sequence from={600} durationInFrames={150}>
        <AbsoluteFill>
          {bgImage3 && (
            <Img
              src={bgImage3}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${interpolate(frame - 600, [0, 150], [1.1, 1])})`,
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(10,10,26,0.95) 0%, rgba(10,10,26,0.5) 100%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <QuantumParticles />
            <GlowText delay={0} fontSize={72}>
              The Quantum Era
            </GlowText>
            <GlowText delay={30} fontSize={72} color="#a855f7">
              Is Here
            </GlowText>
            <div style={{ marginTop: 50 }}>
              <GlowText delay={60} fontSize={28} color="#888">
                Computing power beyond imagination
              </GlowText>
            </div>
          </div>
          {/* Photo credit */}
          <div
            style={{
              position: "absolute",
              bottom: 20,
              right: 30,
              color: "rgba(255,255,255,0.4)",
              fontSize: 14,
              fontFamily: "Arial",
            }}
          >
            Images from Unsplash
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
