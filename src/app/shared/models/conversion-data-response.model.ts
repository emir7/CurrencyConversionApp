import { ConversionRateByDate } from "./conversion-rate-by-date.model";

export interface ConversionDataResponse {
  success: boolean;
  timeseries: boolean;
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, ConversionRateByDate>;
}
