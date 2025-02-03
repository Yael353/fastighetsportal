import { Moment } from "moment";

export const formatUtcString = (date: Moment): string => {
  return date.utc().format("YYYY-MM-DDTHH:mm:ss[UTC]");
};
