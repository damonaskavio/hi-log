import isNumber from "lodash/isNumber";

const toDecimal = (value: string, decimal: number = 2) => {
  if (value.toString().includes(".")) {
    const decimalCount = value.toString().split(".")[1].length;

    if (decimalCount < 2) {
      return value;
    }
    const multiplier = Math.pow(10, decimal);

    return (
      Math.round((isNumber(value) ? value : parseFloat(value)) * multiplier) /
        multiplier || 0
    ).toFixed(2);
  }

  return value;
};

export default toDecimal;
