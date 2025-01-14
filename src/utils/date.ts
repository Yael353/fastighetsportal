import { Moment } from "moment";

export const formatUtcString = (date: Moment): string => {
  return date.format("YYYY-MM-DDTHH:mm:ssUTC");
};
