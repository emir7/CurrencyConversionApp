export interface CurrenciesForm {
  currencies: {
    baseCurrency: string;
    counterCurrency: string;
  };
  amount: number;
}
