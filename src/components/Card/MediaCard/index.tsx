import { CSSProperties, SyntheticEvent } from "react";
import "./index.css";

const MediaCard = ({
  src,
  style = {},
  setRef,
  onImageLoad,
}: {
  src: string;
  style?: CSSProperties;
  setRef?: (el: HTMLElement | null) => void;
  onImageLoad?: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
}) => {
  return (
    <div
      ref={(el) => setRef?.(el)}
      className="media-card-root"
      style={{ ...style }}
    >
      <img
        src={src}
        onLoad={(e) => {
          onImageLoad?.(e);
        }}
      />
    </div>
  );
};

export default MediaCard;
