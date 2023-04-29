import moment from "moment";
import { DefaultTime, Months } from "../constants/dates";

const formatDate = (date: Date | string) => {
  date = new Date(date);
  const month = Months.get(date.getMonth());
  return `${month} ${date.getDate()}, ${date.getFullYear()}`;
};

const isDateBeforeDefaultTime = (date: Date | string) => {
  return moment.utc(date).isSameOrBefore(DefaultTime);
};

export { formatDate, isDateBeforeDefaultTime };
