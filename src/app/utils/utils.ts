import { ConversionDataResponse } from '../shared';

export class Utils {
  public static readonly months: Array<string> = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  public static currencyRateResponseToDataPoints(
    currencyRatesResponse: ConversionDataResponse,
  ): Array<[number, number]> {
    return Object.entries(currencyRatesResponse.rates)
      .reduce((acc: Array<[number, number]>, currentValue) => {
        const [timestamp, value] = currentValue;
        const rates = Object.values(value);

        if (!rates.length) {
          return acc;
        }

        const [rate] = rates;
        const [y1, m1, d1] = timestamp.split('-');
        const date = Date.UTC(Number(y1), Number(m1) - 1, Number(d1));

        acc.push([date, rate]);

        return acc;
      }, [])
      .sort(([date1], [date2]) => {
        return date1 - date2;
      });
  }

  public static findMinRate(dataPoints: Array<[number, number]>): number {
    let min = Number.MAX_VALUE;

    dataPoints.forEach(([_, rate]) => {
      if (rate < min) {
        min = rate;
      }
    });

    return min;
  }
}
