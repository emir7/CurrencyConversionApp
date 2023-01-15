import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CurrenciesInputValue } from './models';
import { AutocompleteItem } from '../autocomplete';

@Component({
  selector: 'currencies-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrenciesInputComponent),
      multi: true,
    },
  ],
  templateUrl: './currencies-input.component.html',
  styleUrls: ['./currencies-input.component.scss'],
})
export class CurrenciesInputComponent implements ControlValueAccessor {
  @Input()
  public fullAutocompleteCurrenciesList: Array<AutocompleteItem> = [];

  public isDisabled: boolean = false;
  public onChange = (value: CurrenciesInputValue) => {};
  public onTouched = () => {};
  public currentValue: CurrenciesInputValue;

  public onBaseCurrencyValueChanged(value: string): void {
    this.writeValue({
      ...this.currentValue,
      baseCurrency: value,
    });
  }

  public onSwapCurrenciesClick() {
    this.writeValue({
      baseCurrency: this.currentValue.counterCurrency,
      counterCurrency: this.currentValue.baseCurrency,
    });
  }

  public onCounterCurrencyValueChanged(value: string): void {
    this.writeValue({
      ...this.currentValue,
      counterCurrency: value,
    });
  }

  public writeValue(value: CurrenciesInputValue) {
    if (value === this.currentValue) {
      return;
    }

    this.currentValue = value;
    this.onChange(this.currentValue);
  }

  public registerOnChange(fn: (value: CurrenciesInputValue) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
