import "./index.css";

type SpacerType = "sm" | "md" | "lg" | "xl";

export type SpacerOptions = {
  type?: SpacerType;
};

const Spacer = ({ type = "md" }: SpacerOptions) => {
  const getClassName = (): string => {
    switch (type) {
      case "sm":
        return "spacer-sm";
      case "md":
        return "spacer-md";
      case "lg":
        return "spacer-lg";
      case "xl":
        return "spacer-xl";
      default:
        return "spacer-md";
    }
  };

  return <div className={getClassName()} />;
};

export default Spacer;
