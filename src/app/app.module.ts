import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';

import { AppComponent } from './app.component';
import { ConversionRateGraphComponent } from './conversion-rate-graph';
import { AutocompleteComponent } from './autocomplete';
import { CurrenciesInputComponent } from './currencies-inputs';

@NgModule({
  declarations: [
    AppComponent,
    AutocompleteComponent,
    CurrenciesInputComponent,
    ConversionRateGraphComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    HighchartsChartModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
