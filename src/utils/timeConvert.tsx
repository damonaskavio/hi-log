// https://stackoverflow.com/questions/13898423/javascript-convert-24-hour-time-of-day-string-to-12-hour-time-with-am-pm-and-no

const timeConvert = (timeStr: string) => {
  const [hourString, minute] = timeStr.split(":");
  const hour = +hourString % 24;
  return (hour % 12 || 12) + ":" + minute + (hour < 12 ? "AM" : "PM");
};

export default timeConvert;
