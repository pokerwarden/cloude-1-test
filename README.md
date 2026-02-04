# Remotion Video Project

A Remotion-based video creation project with multiple compositions and Unsplash integration.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

## Available Videos (Compositions)

| ID | Description | Duration |
|----|-------------|----------|
| `HelloWorld` | Hebrew welcome text with fade animations | 10s |
| `NewShoes` | Animated shoe promo (no images) | 20s |
| `PokerReplay` | Animated poker hand replay | 30s |
| `ShoesVideo` | Shoe promo with Unsplash images | 18s |
| `QuantumComputer` | Quantum computing explainer | 25s |
| `UnsplashDemo` | Nature slideshow demo | 31s |

## Project Structure

```
src/
├── index.ts              # Entry point
├── Root.tsx              # All compositions defined here
├── HelloWorld.tsx        # Hebrew welcome video
├── NewShoes.tsx          # Shoe promo (animated graphics)
├── ShoesVideo.tsx        # Shoe promo (Unsplash images)
├── PokerReplay.tsx       # Poker hand animation
├── QuantumComputer.tsx   # Quantum computing video
├── UnsplashDemo.tsx      # Unsplash slideshow
├── hooks/
│   └── useUnsplash.ts    # React hooks for Unsplash
└── utils/
    └── unsplash.ts       # Unsplash API functions
```

## Unsplash Integration

**API Key is already configured** in `src/utils/unsplash.ts`

### Usage in Components

```tsx
import { useUnsplashSearch } from "./hooks/useUnsplash";

// Fetch images (limit to 3-5 for rate limits)
const { photos, loading, error } = useUnsplashSearch("your search term", {
  perPage: 3,
  orientation: "landscape"
});

// Use the image
<Img src={photos[0]?.urls.regular} />
```

### Rate Limits
- Free tier: 50 requests/hour
- Keep `perPage` low (3-5 images per video)

## Creating New Videos

1. Create component in `src/YourVideo.tsx`
2. Add to `src/Root.tsx`:

```tsx
import { YourVideo } from "./YourVideo";

// Inside RemotionRoot component, add:
<Composition
  id="YourVideo"
  component={YourVideo}
  durationInFrames={300}  // 10 seconds at 30fps
  fps={30}
  width={1920}
  height={1080}
/>
```

## Useful Remotion Patterns

### Animation with interpolate
```tsx
const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateRight: "clamp",
});
```

### Sequences (timed sections)
```tsx
<Sequence from={0} durationInFrames={90}>
  {/* Content for first 3 seconds */}
</Sequence>
<Sequence from={90} durationInFrames={90}>
  {/* Content for seconds 3-6 */}
</Sequence>
```

### Easing
```tsx
import { Easing } from "remotion";

interpolate(frame, [0, 30], [0, 100], {
  easing: Easing.out(Easing.ease),
});
```

## Rendering Videos

```bash
# Render specific composition
npx remotion render HelloWorld out/hello.mp4
npx remotion render PokerReplay out/poker.mp4

# Requires Chrome/Chromium installed locally
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Remotion Studio |
| `npm run render` | Render HelloWorld to MP4 |
| `npm run build` | Bundle for production |
| `npx tsc --noEmit` | Type check |

## Frame/Time Reference

At 30fps:
- 30 frames = 1 second
- 150 frames = 5 seconds
- 300 frames = 10 seconds
- 600 frames = 20 seconds
- 900 frames = 30 seconds
