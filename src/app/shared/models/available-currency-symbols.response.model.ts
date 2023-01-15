import { CurrencySymbol } from "./currency-symbol.model";

export interface AvailableCurrencySymbolsResponse {
  success: boolean;
  symbols: Record<string, CurrencySymbol>
}
