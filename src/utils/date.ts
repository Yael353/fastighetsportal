import moment, { Moment } from "moment";

export const formatUtcString = (date: Moment): string => {
  return date.utc().format("YYYY-MM-DDTHH:mm:ss[UTC]");
};


export const formatData = (
  data: {
    time_utc: string;
    value: number;
  }[]
) => {
  return data.map((e) => {
    const time = moment(e.time_utc.replace("UTC", "")).toDate().getTime();
    const value = e.value;
    return { id: 0, time, value };
  });
};
