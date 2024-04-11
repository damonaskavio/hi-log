import "./index.css";

const MediaCard = ({ src }: { src: string }) => {
  return (
    <div className="media-card-root">
      <img src={src} />
    </div>
  );
};

export default MediaCard;
