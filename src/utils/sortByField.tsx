type GenericType = string | number | Date;

const getSortFn = <T extends object>(
  fieldValue: T[keyof T] | GenericType,
  sort: "asc" | "desc"
): ((a: T[keyof T] | GenericType, b: T[keyof T] | GenericType) => number) => {
  const getCompares = (a: typeof fieldValue, b: typeof fieldValue) => {
    if (sort === "desc") {
      return [b, a];
    }

    return [a, b];
  };
  switch (typeof fieldValue) {
    case "string":
      return (a, b): number => {
        const [c, d] = getCompares(a, b);

        if (c > d) {
          return 1;
        }

        if (c < d) {
          return -1;
        }

        return 0;
      };
    case "number":
      return (a, b): number => {
        const [c, d] = getCompares(a, b);

        return +c - +d;
      };
    default:
      break;
  }

  if (fieldValue instanceof Date) {
    return (a, b): number => {
      const [c, d] = getCompares(a, b);

      return (c as Date).getTime() - (d as Date).getTime();
    };
  }

  return (): number => {
    return 0;
  };
};

const sortByField = <T extends object>(
  array: T[],
  {
    field,
    sort,
    fieldFn,
  }: {
    field: keyof T;
    sort: "asc" | "desc";
    fieldFn?: (obj: T) => T[keyof T] | GenericType;
  }
) => {
  const arr = [...array];

  if (arr.length > 0) {
    const getFieldValue = (obj: (typeof arr)[0], f: typeof field) => {
      return fieldFn ? fieldFn(obj) : obj[f];
    };

    const fieldValue = getFieldValue(arr[0], field);

    const sortFn = getSortFn<(typeof arr)[0]>(fieldValue, sort);

    arr.sort((a, b) =>
      sortFn(getFieldValue(a, field), getFieldValue(b, field))
    );
  }

  return arr;
};

export default sortByField;
