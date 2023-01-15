import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Utils } from '../utils';

@Component({
  selector: 'conversion-rate-graph',
  templateUrl: './conversion-rate-graph.component.html',
})
export class ConversionRateGraphComponent {
  @Input('data')
  public set dataValue(data: Array<[number, number]>) {
    this.data = data;

    this.chartOptions = {
      ...this.chartOptions,
      yAxis: {
        ...this.chartOptions.yAxis,
        min: Utils.findMinRate(data),
      },
      series: [
        {
          type: 'area',
          data: this.data,
        },
      ],
    };
  }
  public data: Array<[number, number]> = [];

  public Highcharts: typeof Highcharts = Highcharts;
  public chartOptions: Highcharts.Options = {
    tooltip: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      type: 'datetime',
      gridLineWidth: 1,
      dateTimeLabelFormats: {
        month: '%e. %b',
        year: '%b',
      },
    },
    yAxis: {
      title: {
        text: null,
      },
      gridLineWidth: 1,
    },
    series: [
      {
        type: 'area',
        data: [],
      },
    ],
    title: undefined,
    credits: {
      enabled: false,
    },
    plotOptions: {
      area: {
        fillColor: 'rgba(217, 154, 222, 0.8)',
        lineColor: '#cd0863',
      },
      series: {
        marker: {
          fillColor: '#cd0863',
          radius: 7,
        },
      },
    },
  };
}
