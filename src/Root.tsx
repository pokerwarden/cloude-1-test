import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { NewShoes } from "./NewShoes";
import { PokerReplay } from "./PokerReplay";
import { UnsplashDemo } from "./UnsplashDemo";
import { ShoesVideo } from "./ShoesVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="NewShoes"
        component={NewShoes}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PokerReplay"
        component={PokerReplay}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="UnsplashDemo"
        component={UnsplashDemo}
        durationInFrames={930}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ShoesVideo"
        component={ShoesVideo}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
