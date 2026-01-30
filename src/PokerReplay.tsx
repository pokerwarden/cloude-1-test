import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
  Sequence,
} from "remotion";

// Card suit symbols and colors
const SUITS: Record<string, { symbol: string; color: string }> = {
  s: { symbol: "♠", color: "#000000" },
  h: { symbol: "♥", color: "#e74c3c" },
  d: { symbol: "♦", color: "#e74c3c" },
  c: { symbol: "♣", color: "#000000" },
};

const RANKS: Record<string, string> = {
  A: "A", K: "K", Q: "Q", J: "J", T: "10",
  "9": "9", "8": "8", "7": "7", "6": "6", "5": "5",
  "4": "4", "3": "3", "2": "2",
};

// Card component
const Card: React.FC<{
  card: string; // e.g., "Kc" for King of clubs
  faceDown?: boolean;
  scale?: number;
  style?: React.CSSProperties;
}> = ({ card, faceDown = false, scale = 1, style = {} }) => {
  const rank = card[0];
  const suit = card[1];
  const suitInfo = SUITS[suit];

  const cardWidth = 70 * scale;
  const cardHeight = 100 * scale;

  if (faceDown) {
    return (
      <div
        style={{
          width: cardWidth,
          height: cardHeight,
          borderRadius: 8 * scale,
          background: "linear-gradient(135deg, #1a237e 0%, #283593 50%, #1a237e 100%)",
          border: `2px solid #fff`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "2px 2px 10px rgba(0,0,0,0.3)",
          ...style,
        }}
      >
        <div
          style={{
            width: cardWidth * 0.7,
            height: cardHeight * 0.8,
            borderRadius: 4 * scale,
            background: "repeating-linear-gradient(45deg, #3949ab, #3949ab 5px, #5c6bc0 5px, #5c6bc0 10px)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: cardWidth,
        height: cardHeight,
        borderRadius: 8 * scale,
        backgroundColor: "#ffffff",
        border: `2px solid #ddd`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 6 * scale,
        boxShadow: "2px 2px 10px rgba(0,0,0,0.3)",
        fontFamily: "Georgia, serif",
        ...style,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <span style={{ fontSize: 20 * scale, fontWeight: "bold", color: suitInfo.color, lineHeight: 1 }}>
          {RANKS[rank]}
        </span>
        <span style={{ fontSize: 16 * scale, color: suitInfo.color, lineHeight: 1 }}>
          {suitInfo.symbol}
        </span>
      </div>
      <div style={{ fontSize: 32 * scale, color: suitInfo.color, textAlign: "center" }}>
        {suitInfo.symbol}
      </div>
    </div>
  );
};

// Player position component
const PlayerSeat: React.FC<{
  name: string;
  stack: string;
  cards?: string[];
  showCards?: boolean;
  isHero?: boolean;
  position: { x: number; y: number };
  isFolded?: boolean;
  isWinner?: boolean;
  betAmount?: string;
  isButton?: boolean;
  isActive?: boolean;
}> = ({ name, stack, cards, showCards, isHero, position, isFolded, isWinner, betAmount, isButton, isActive }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: isFolded ? 0.4 : 1,
        transform: isActive ? "scale(1.05)" : "scale(1)",
        transition: "all 0.3s ease",
      }}
    >
      {/* Cards */}
      {cards && cards.length > 0 && (
        <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
          {cards.map((card, i) => (
            <Card key={i} card={card} faceDown={!showCards} scale={isHero ? 0.9 : 0.7} />
          ))}
        </div>
      )}

      {/* Player info box */}
      <div
        style={{
          background: isHero
            ? "linear-gradient(180deg, #f39c12 0%, #e67e22 100%)"
            : isWinner
              ? "linear-gradient(180deg, #27ae60 0%, #1e8449 100%)"
              : "linear-gradient(180deg, #34495e 0%, #2c3e50 100%)",
          padding: "8px 16px",
          borderRadius: 8,
          minWidth: 100,
          textAlign: "center",
          border: isActive ? "3px solid #f1c40f" : "2px solid rgba(255,255,255,0.2)",
          boxShadow: isWinner ? "0 0 20px rgba(46, 204, 113, 0.5)" : "0 2px 10px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ color: "#fff", fontSize: 14, fontWeight: "bold", marginBottom: 2 }}>
          {name} {isButton && "🔘"}
        </div>
        <div style={{ color: "#bdc3c7", fontSize: 12 }}>{stack}</div>
      </div>

      {/* Bet amount */}
      {betAmount && (
        <div
          style={{
            marginTop: 8,
            background: "#2ecc71",
            color: "#fff",
            padding: "4px 12px",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: "bold",
          }}
        >
          ${betAmount}
        </div>
      )}
    </div>
  );
};

// Community cards component
const CommunityCards: React.FC<{
  cards: string[];
  revealCount: number;
}> = ({ cards, revealCount }) => {
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
      {cards.slice(0, revealCount).map((card, i) => (
        <Card key={i} card={card} scale={1.1} />
      ))}
    </div>
  );
};

// Pot display
const PotDisplay: React.FC<{ amount: string }> = ({ amount }) => (
  <div
    style={{
      background: "linear-gradient(180deg, #8e44ad 0%, #6c3483 100%)",
      padding: "12px 24px",
      borderRadius: 20,
      color: "#fff",
      fontSize: 24,
      fontWeight: "bold",
      boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    }}
  >
    Pot: ${amount}
  </div>
);

// Action text component
const ActionText: React.FC<{ text: string; subtext?: string }> = ({ text, subtext }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame % 60, [0, 10, 50, 60], [0, 1, 1, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
      }}
    >
      <div style={{ color: "#f1c40f", fontSize: 36, fontWeight: "bold", textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
        {text}
      </div>
      {subtext && (
        <div style={{ color: "#ecf0f1", fontSize: 20, marginTop: 8 }}>
          {subtext}
        </div>
      )}
    </div>
  );
};

// Main Poker Replay Component
// Hand #HD2702302604: Hero wins $1.02 with Kc Qc (two pair Kings and Queens)
export const PokerReplay: React.FC = () => {
  const frame = useCurrentFrame();

  // Player positions around the table (6-max)
  const positions = {
    seat1: { x: 860, y: 680 },   // Hero - bottom center
    seat2: { x: 1400, y: 500 },  // e2a403aa - right
    seat3: { x: 1400, y: 200 },  // 32d05861 - top right
    seat4: { x: 860, y: 80 },    // 991bfadd - top center
    seat5: { x: 320, y: 200 },   // 6d2c55bc - top left
    seat6: { x: 320, y: 500 },   // 671b4a36 - left
  };

  // Animation phases (in frames at 30fps)
  const PHASE = {
    INTRO: 0,
    DEAL: 60,
    PREFLOP: 120,
    FLOP: 240,
    FLOP_ACTION: 300,
    TURN: 420,
    TURN_ACTION: 480,
    RIVER: 570,
    SHOWDOWN: 660,
    WINNER: 780,
  };

  // Determine current phase
  const showHeroCards = frame >= PHASE.DEAL;
  const showVillainCards = frame >= PHASE.SHOWDOWN;
  const flopRevealed = frame >= PHASE.FLOP ? 3 : 0;
  const turnRevealed = frame >= PHASE.TURN ? 4 : flopRevealed;
  const riverRevealed = frame >= PHASE.RIVER ? 5 : turnRevealed;
  const cardsRevealed = riverRevealed;

  // Pot size progression
  const getPotSize = () => {
    if (frame < PHASE.FLOP) return "0.39"; // preflop pot
    if (frame < PHASE.TURN) return "0.65"; // after flop betting
    if (frame < PHASE.RIVER) return "1.09"; // after turn betting
    return "1.09"; // final pot
  };

  // Table felt animation
  const tableScale = interpolate(frame, [0, 30], [0.9, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  // Winner highlight animation
  const winnerGlow = frame >= PHASE.WINNER
    ? interpolate(frame % 30, [0, 15, 30], [0.5, 1, 0.5])
    : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a2e",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 50%, #2d2d4a 0%, #1a1a2e 100%)",
        }}
      />

      {/* Poker Table */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${tableScale})`,
          width: 1000,
          height: 500,
          borderRadius: 250,
          background: "linear-gradient(180deg, #0d5c2e 0%, #0a4a25 50%, #073d1e 100%)",
          border: "15px solid #5d4037",
          boxShadow: "0 0 50px rgba(0,0,0,0.5), inset 0 0 100px rgba(0,0,0,0.3)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Table rail */}
        <div
          style={{
            position: "absolute",
            inset: -20,
            borderRadius: 270,
            border: "20px solid #3e2723",
            pointerEvents: "none",
          }}
        />

        {/* Pot */}
        <PotDisplay amount={getPotSize()} />

        {/* Community Cards */}
        <div style={{ marginTop: 20 }}>
          <CommunityCards
            cards={["7d", "Jh", "Qs", "Kd", "Jd"]}
            revealCount={cardsRevealed}
          />
        </div>
      </div>

      {/* Hand Info */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "#fff",
          fontSize: 18,
        }}
      >
        <div style={{ color: "#7f8c8d", fontSize: 14 }}>Hand #HD2702302604</div>
        <div style={{ marginTop: 5 }}>Hold'em No Limit ($0.01/$0.02)</div>
        <div style={{ color: "#7f8c8d", fontSize: 14, marginTop: 5 }}>Table 'NLHWhite20' 6-max</div>
      </div>

      {/* Players */}
      {/* Seat 1: Hero */}
      <PlayerSeat
        name="Hero"
        stack="$2.38"
        cards={showHeroCards ? ["Kc", "Qc"] : undefined}
        showCards={true}
        isHero={true}
        position={positions.seat1}
        isWinner={frame >= PHASE.WINNER}
        betAmount={frame >= PHASE.PREFLOP && frame < PHASE.FLOP ? "0.18" : frame >= PHASE.FLOP_ACTION && frame < PHASE.TURN ? "0.13" : frame >= PHASE.TURN_ACTION && frame < PHASE.RIVER ? "0.22" : undefined}
      />

      {/* Seat 2: e2a403aa (button) - main villain */}
      <PlayerSeat
        name="e2a403aa"
        stack="$2.00"
        cards={showVillainCards ? ["Ks", "As"] : frame >= PHASE.DEAL ? ["??", "??"] : undefined}
        showCards={showVillainCards}
        position={positions.seat2}
        isButton={true}
        betAmount={frame >= PHASE.PREFLOP && frame < PHASE.FLOP ? "0.18" : frame >= PHASE.FLOP_ACTION && frame < PHASE.TURN ? "0.13" : frame >= PHASE.TURN_ACTION && frame < PHASE.RIVER ? "0.22" : undefined}
      />

      {/* Seat 3: 32d05861 (small blind) - folded */}
      <PlayerSeat
        name="32d05861"
        stack="$2.03"
        position={positions.seat3}
        isFolded={frame >= PHASE.PREFLOP}
      />

      {/* Seat 4: 991bfadd (big blind) - folded */}
      <PlayerSeat
        name="991bfadd"
        stack="$2.00"
        position={positions.seat4}
        isFolded={frame >= PHASE.PREFLOP}
      />

      {/* Seat 5: 6d2c55bc - folded */}
      <PlayerSeat
        name="6d2c55bc"
        stack="$1.97"
        position={positions.seat5}
        isFolded={frame >= PHASE.PREFLOP}
      />

      {/* Seat 6: 671b4a36 - folded */}
      <PlayerSeat
        name="671b4a36"
        stack="$3.15"
        position={positions.seat6}
        isFolded={frame >= PHASE.PREFLOP}
      />

      {/* Action Text Sequences */}
      <Sequence from={PHASE.INTRO} durationInFrames={60}>
        <ActionText text="Hand #HD2702302604" subtext="Hold'em No Limit $0.01/$0.02" />
      </Sequence>

      <Sequence from={PHASE.DEAL} durationInFrames={60}>
        <ActionText text="Dealing Cards" subtext="Hero receives K♣ Q♣" />
      </Sequence>

      <Sequence from={PHASE.PREFLOP} durationInFrames={60}>
        <ActionText text="Pre-Flop" subtext="Hero raises to $0.06 • e2a403aa 3-bets to $0.18 • Hero calls" />
      </Sequence>

      <Sequence from={PHASE.FLOP} durationInFrames={60}>
        <ActionText text="★ FLOP ★" subtext="7♦ J♥ Q♠" />
      </Sequence>

      <Sequence from={PHASE.FLOP_ACTION} durationInFrames={60}>
        <ActionText text="Flop Action" subtext="Hero bets $0.13 • e2a403aa calls" />
      </Sequence>

      <Sequence from={PHASE.TURN} durationInFrames={60}>
        <ActionText text="★ TURN ★" subtext="K♦ - Hero makes Two Pair!" />
      </Sequence>

      <Sequence from={PHASE.TURN_ACTION} durationInFrames={60}>
        <ActionText text="Turn Action" subtext="Hero bets $0.22 • e2a403aa calls" />
      </Sequence>

      <Sequence from={PHASE.RIVER} durationInFrames={60}>
        <ActionText text="★ RIVER ★" subtext="J♦" />
      </Sequence>

      <Sequence from={PHASE.SHOWDOWN} durationInFrames={90}>
        <ActionText text="SHOWDOWN" subtext="Hero: K♣Q♣ (Two Pair, Kings & Queens) vs e2a403aa: K♠A♠ (Two Pair, Kings & Jacks)" />
      </Sequence>

      <Sequence from={PHASE.WINNER} durationInFrames={120}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            zIndex: 100,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: "bold",
              color: "#2ecc71",
              textShadow: `0 0 ${20 + winnerGlow * 30}px rgba(46, 204, 113, ${0.5 + winnerGlow * 0.5})`,
              animation: "pulse 1s infinite",
            }}
          >
            HERO WINS!
          </div>
          <div style={{ fontSize: 48, color: "#f1c40f", marginTop: 20 }}>
            $1.02
          </div>
          <div style={{ fontSize: 24, color: "#ecf0f1", marginTop: 10 }}>
            Two Pair, Kings and Queens
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
