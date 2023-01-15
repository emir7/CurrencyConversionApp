import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, map } from 'rxjs';

import {
  AvailableCurrencySymbolsResponse,
  ConversionDataResponse,
  CurrencySymbol,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class CurrencyApiService {
  private readonly BASE_API_URL: string = 'https://api.exchangerate.host';

  public constructor(private readonly httpClient: HttpClient) {}

  public async getAvailableCurrencies(): Promise<Array<string>> {
    return lastValueFrom(
      this.httpClient
        .get<AvailableCurrencySymbolsResponse>(`${this.BASE_API_URL}/symbols`)
        .pipe(
          map((response: AvailableCurrencySymbolsResponse) => {
            return Object.values(response.symbols).map(
              (symbol: CurrencySymbol) => symbol.code,
            );
          }),
        ),
    );
  }

  public async getConversionData(
    baseCurrency: string,
    counterCurrency: string,
  ): Promise<ConversionDataResponse> {
    return lastValueFrom(
      this.httpClient.get<ConversionDataResponse>(
        `${this.BASE_API_URL}/timeseries`,
        {
          params: {
            start_date: this.getStartDate(),
            end_date: this.getEndDate(),
            base: baseCurrency,
            symbols: counterCurrency,
          },
        },
      ),
    );
  }

  private getStartDate(): string {
    const currentDate: Date = new Date();
    currentDate.setDate(currentDate.getDate() - 7);

    return this.formatDate(currentDate);
  }

  private getEndDate(): string {
    return this.formatDate(new Date());
  }

  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${this.padZero(
      date.getMonth() + 1,
    )}-${this.padZero(date.getDate())}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : String(value);
  }
}
