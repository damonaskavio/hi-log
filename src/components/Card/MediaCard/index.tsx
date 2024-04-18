import { SyntheticEvent } from "react";
import Card from "..";
import "./index.css";

const MediaCard = ({
  src,
  onImageLoad,
  onClick,
  checked = false,
  selected = false,
  onChecked,
  onUnchecked,
  hasChecked = false,
}: {
  src: string;
  onImageLoad?: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
  onClick?: () => void;
  checked?: boolean;
  selected?: boolean;
  onChecked?: () => void;
  onUnchecked?: () => void;
  hasChecked?: boolean;
}) => {
  const handleClick = () => {
    if (checked) {
      onUnchecked?.();

      return;
    }

    if (hasChecked) {
      onChecked?.();
      return;
    }

    onClick?.();
  };

  return (
    <Card
      onClick={handleClick}
      onLongPress={onChecked}
      className="media-card-root"
      checked={checked}
      selected={selected}
    >
      <img
        src={src}
        onLoad={(e) => {
          onImageLoad?.(e);
        }}
      />
    </Card>
  );
};

export default MediaCard;
