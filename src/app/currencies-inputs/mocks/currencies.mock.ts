import { CurrenciesInputValue } from '../models';

export const currenciesMock: CurrenciesInputValue = {
  baseCurrency: 'EUR',
  counterCurrency: 'USD',
};

export const swappedCurrenciesMock: CurrenciesInputValue = {
  baseCurrency: 'USD',
  counterCurrency: 'EUR',
};
