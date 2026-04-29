import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.page.html',
  styleUrls: ['./statistic.page.scss'],
  standalone: false
})
export class StatisticPage implements OnInit {

  @ViewChild('myChart', { static: false })
  chartRef!: ElementRef;

  chart: any;
  totalWorklogs = 0;
  totalTasks = 0;
  bestDay = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    this.api.getWorklogs().subscribe((res: any) => {
      const data = res.data || res;

      this.totalWorklogs = data.length;

      this.totalTasks = data.reduce((sum: number, item: any) => {
        return sum + parseInt(item.task_count || 0);
      }, 0);

      const grouped: any = {};

      data.forEach((item: any) => {
        const date = item.date;
        const task = parseInt(item.task_count) || 0;

        grouped[date] = (grouped[date] || 0) + task;
      });

      const labels = Object.keys(grouped);
      const values = Object.values(grouped) as number[];

      const max = Math.max(...values);
      const index = values.indexOf(max);
      this.bestDay = labels[index];

      const formatLabel = labels.map(date =>
        new Date(date).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short'
        })
      );

      if (this.chart) {
        this.chart.destroy();
      }

      setTimeout(() => {
        if (this.chartRef && this.chartRef.nativeElement) {
                  this.chart = new Chart(this.chartRef.nativeElement, {
          type: 'bar',
          data: {
            labels: formatLabel,
            datasets: [{
              label: 'Tasks',
              data: values,

              backgroundColor: 'rgba(41, 104, 97, 0.7)', 
              borderColor: 'rgba(41, 104, 97, 1)',
              borderWidth: 0,
              borderRadius: 12, 
              borderSkipped: false,
              hoverBackgroundColor: 'rgba(41, 104, 97, 1)',
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false, 
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: '#191c1d',
                padding: 12,
                cornerRadius: 12,
                displayColors: false,
                titleFont: { family: 'Plus Jakarta Sans', size: 13 },
                bodyFont: { family: 'Plus Jakarta Sans', size: 14, weight: 'bold' }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                border: { display: false }, 
                grid: {
                  color: '#f0f0f0',
                  drawTicks: false,
                },
                ticks: {
                  color: '#949f9d',
                  stepSize: 1,
                  font: { family: 'Plus Jakarta Sans', size: 11 }
                }
              },
              x: {
                border: { display: false },
                grid: {
                  display: false 
                },
                ticks: {
                  color: '#6f7977',
                  font: { family: 'Plus Jakarta Sans', size: 11 }
                }
              }
            },
            layout: {
              padding: {
                top: 10
              }
            }
          }
        });
        }
      }, 100);
    });
  }
}