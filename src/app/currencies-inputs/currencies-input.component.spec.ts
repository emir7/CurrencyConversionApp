import { CurrenciesInputComponent } from './currencies-input.component';
import { currenciesMock, swappedCurrenciesMock } from './mocks';

describe('CurrenciesInputComponent', () => {
  let currenciesInputComponent: CurrenciesInputComponent;

  beforeEach(() => {
    currenciesInputComponent = new CurrenciesInputComponent();
  });

  it('should swap currencies and propagate changes to parent component', () => {
    const writeValueSpy: jest.SpyInstance = jest.spyOn(
      currenciesInputComponent,
      'writeValue',
    );
    const onChangeSpy: jest.SpyInstance = jest.spyOn(
      currenciesInputComponent,
      'onChange',
    );

    currenciesInputComponent.currentValue = currenciesMock;

    currenciesInputComponent.onSwapCurrenciesClick();

    expect(writeValueSpy).toBeCalledWith(swappedCurrenciesMock);
    expect(onChangeSpy).toBeCalledWith(swappedCurrenciesMock);
  });
});
