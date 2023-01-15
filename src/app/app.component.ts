import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { distinctUntilChanged, Subscription, tap } from 'rxjs';

import {
  ConversionDataResponse,
  CurrencyApiService,
  DocumentListenerService,
} from './shared';
import { Utils } from './utils';
import { AutocompleteItem } from './autocomplete';
import { CurrenciesForm } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  @HostListener('document:click', ['$event'])
  public documentClick($event: MouseEvent): void {
    this.documentListenerService.documentClickEvent.next($event);
  }

  public baseCurrency: string = 'EUR';
  public counterCurrency: string = 'USD';
  public form: FormGroup;
  public availableCurrenciesList: Array<string> = [];
  public fullAutocompleteCurrenciesList: Array<AutocompleteItem> = [];
  public subscriptions: Subscription = new Subscription();
  public chartDataPoints: Array<[number, number]> = [];
  public currentConversionRate: number = 0;
  public currentAmount: number = 200;
  public convertedAmount: number = 200;
  public today: number = Date.now();

  public constructor(
    private readonly currencyApiService: CurrencyApiService,
    private readonly formBuilder: FormBuilder,
    private readonly documentListenerService: DocumentListenerService,
  ) {}

  public async ngOnInit(): Promise<void> {
    this.initForm();
    this.setSubscriptions();

    await this.fetchAndSetData();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private async fetchAndSetData(): Promise<void> {
    this.availableCurrenciesList =
      await this.currencyApiService.getAvailableCurrencies();

    this.setupAutocompleteList();
    this.setFormValues();
  }

  private setupAutocompleteList(): void {
    this.fullAutocompleteCurrenciesList = this.availableCurrenciesList.map(
      (currency: string) => {
        return {
          value: currency,
          isHighlighted: false,
        };
      },
    );
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      currencies: {
        baseCurrency: null,
        counterCurrency: null,
      },
      amount: null,
    });
  }

  private setFormValues(): void {
    this.form.setValue({
      currencies: {
        baseCurrency: this.baseCurrency,
        counterCurrency: this.counterCurrency,
      },
      amount: this.currentAmount,
    });
  }

  private setSubscriptions(): void {
    this.subscriptions.add(
      this.form.valueChanges
        .pipe(
          tap((formValue: CurrenciesForm) => {
            this.currentAmount = formValue.amount;
            this.convertedAmount =
              this.currentAmount * this.currentConversionRate;
          }),
          distinctUntilChanged(
            (previous: CurrenciesForm, current: CurrenciesForm) => {
              return (
                previous.currencies.baseCurrency ===
                  current.currencies.baseCurrency &&
                previous.currencies.counterCurrency ===
                  current.currencies.counterCurrency
              );
            },
          ),
        )
        .subscribe(async (value) => {
          this.currentAmount = value.amount;
          this.baseCurrency = value.currencies.baseCurrency;
          this.counterCurrency = value.currencies.counterCurrency;

          await this.fetchConversionRatesAndConvertAmount();
        }),
    );
  }

  private async fetchConversionRatesAndConvertAmount(): Promise<void> {
    const response: ConversionDataResponse =
      await this.currencyApiService.getConversionData(
        this.baseCurrency,
        this.counterCurrency,
      );

    this.chartDataPoints = Utils.currencyRateResponseToDataPoints(response);

    const [_, conversionRate] =
      this.chartDataPoints[this.chartDataPoints.length - 1];

    this.currentConversionRate = conversionRate;
    this.convertedAmount = this.currentAmount * this.currentConversionRate;
  }
}
