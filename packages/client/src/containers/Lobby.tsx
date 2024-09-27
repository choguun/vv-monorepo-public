import { LoadingScreen } from "../amalgema-ui/LoadingScreen";
import { UIRoot } from "../amalgema-ui/UIRoot";
import { useStore } from "../hooks/useStore";

export const Lobby = () => {
  const networkLayer = useStore((state) => state.networkLayer);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <LoadingScreen networkLayer={networkLayer} usePrepTime={true} />
      <UIRoot />
    </div>
  );
};
