import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title} from '@angular/platform-browser';
import {Chart} from 'chart.js';


interface ChartTypeRegistry {
  line: 'line';
  bar: 'bar';
  radar: 'radar';
}


interface Workout {
  type: string;
  minutes: number;
}

interface User {
  id: number;
  name: string;
  workouts: Workout[];
}

interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  aspectRatio?: number;
}

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.css']
})
export class UserReportComponent implements OnInit {
  data: any;
  username: string = '';
  userData: User | null = null;
  chartData: any = null;
  options: ChartOptions = {};
  chartType: string ='bar';

  constructor(private route: ActivatedRoute, private titleService: Title) { 
    this.data = {};
  }

  ngOnInit(): void {
    this.titleService.setTitle('Reports | Fyle');
    this.route.params.subscribe(params => {
      this.username = params['username'] ?? '';
      this.loadUserDataFromLocalStorage();
    });
  }

  loadUserDataFromLocalStorage() {
    const localStorageData = localStorage.getItem('userData');
    if (localStorageData) {
      const parsedData: User[] = JSON.parse(localStorageData);
      this.userData = parsedData.find(user => user.name.toLowerCase().replace(/\s+/g, '').split(',').join('') === this.username) ?? null;
      if (this.userData) {
        this.prepareChartData();
      } else {
        console.error(`User ${this.username} not found in localStorage data.`);
      }
    } else {
      console.error('No userData found in localStorage.');
    }
  }
  changeChartType(event: any): void{
    this.chartType= event.target.value;
    this.loadUserDataFromLocalStorage();
  }
  
  prepareChartData() {
    const validChartTypes: keyof ChartTypeRegistry = 'bar';
    if (!this.userData) {
      console.error('User data is null or undefined.');
      return;
    }
    const labels: string[] = this.userData.workouts.map(w => w.type);
    const data: number[] = this.userData.workouts.map(w => w.minutes);

    if (this.chartData) {
      this.chartData.destroy();
    }

    this.chartData = new Chart("MyChart", {
      type: this.chartType as ChartTypeRegistry[keyof ChartTypeRegistry],
      data: {
        labels: labels, 
	       datasets: [
          {
            label: "Time",
            data: data,
            backgroundColor:  [
              'rgba(255, 99, 132, 0.65)',
              'rgba(153, 102, 255, 0.65)',
              'rgba(255, 159, 64, 0.65)',
              'rgba(255, 205, 86, 0.65)',
              'rgba(75, 192, 192, 0.65)',
              'rgba(54, 162, 235, 0.65)',
              'rgba(201, 203, 207, 0.65)'     
            ],
          }
        ]
      },
      options: {
        aspectRatio:2.5
      }
    });
  }

  getTotalMinutes(): number {
    if (!this.userData) {
      return 0;
    }
    return this.userData.workouts.reduce((total, workout) => total + workout.minutes, 0);
  }
}
