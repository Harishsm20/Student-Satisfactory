import { Injectable } from '@angular/core';
import {
  ChartData,
  ChartDataset,
  ChartOptions,
  ChartType,
  PluginOptionsByType,
  ScaleOptions,
  TooltipLabelStyle
} from 'chart.js';
// import { DeepPartial } from 'chart.js/dist/types/utils';
import { getStyle, hexToRgba } from '@coreui/utils';

export interface IChartProps {
  data?: ChartData;
  labels?: any;
  options?: ChartOptions;
  colors?: any;
  type: ChartType;
  legend?: any;

  [propName: string]: any;
}

@Injectable({
  providedIn: 'any'
})
export class DashboardChartsData {


  options = {
    maintainAspectRatio: false
  };

  questions = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

  chartBarData: ChartData = {
    labels: [...this.questions].slice(0, 10),
    datasets: [
      {
        label: 'Surevy Points',
        backgroundColor: '#f87979',
        data: [2.6, 3.8, 4.2, 3.6, 2.5, 5, 3.4, 1.9, 2.9, 5]
      }
    ]
  };

  chartBarOptions = {
    maintainAspectRatio: false,
  };
}