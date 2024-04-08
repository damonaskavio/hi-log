import "./index.css";

type SpacerType = "sm" | "md" | "lg" | "xl";

export type SpacerOptions = {
  type?: SpacerType;
  flex?: number;
};

const Spacer = ({ type = "md", flex }: SpacerOptions) => {
  const getClassName = (): string => {
    if (flex) {
      return "";
    }

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

  return <div style={flex ? { flex } : {}} className={getClassName()} />;
};

export default Spacer;
