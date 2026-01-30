import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { NewShoes } from "./NewShoes";

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
    </>
  );
};
