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

      // Tunggu view siap
      setTimeout(() => {
        if (this.chartRef && this.chartRef.nativeElement) {
          this.chart = new Chart(this.chartRef.nativeElement, {
            type: 'bar',
            data: {
              labels: formatLabel,
              datasets: [{
                label: 'Produktivitas',
                data: values,
                borderWidth: 1,
                borderRadius: 8,
                backgroundColor: 'rgba(102, 126, 234, 0.7)',
                borderColor: 'rgba(102, 126, 234, 1)',
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                  labels: {
                    color: '#1a1a1a',
                    font: {
                      size: 12
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: '#7a7a7a',
                    stepSize: 1
                  },
                  grid: {
                    color: '#eeeeee'
                  }
                },
                x: {
                  ticks: {
                    color: '#7a7a7a'
                  },
                  grid: {
                    display: false
                  }
                }
              }
            }
          });
        }
      }, 100);
    });
  }
}