import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Chart} from 'chart.js';

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

  constructor(private route: ActivatedRoute) { 
    this.data = {};
  }

  ngOnInit(): void {
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

  prepareChartData() {
    if (!this.userData) {
      console.error('User data is null or undefined.');
      return;
    }
    const labels: string[] = this.userData.workouts.map(w => w.type);
    const data: number[] = this.userData.workouts.map(w => w.minutes);
    const backgroundColors: string[] = labels.map((label, index) => {
      return this.getRandomColor(index);
    });
    this.chartData = new Chart("MyChart", {
      type: 'bar',
      data: {
        labels: labels, 
	       datasets: [
          {
            label: "Time",
            data: data,
            backgroundColor:  [
              'rgba(31, 119, 180, 0.9)',  
              'rgba(255, 127, 14, 0.6)',  
              'rgba(44, 160, 44, 0.9)',   
              'rgba(214, 39, 40, 0.6)',   
              'rgba(148, 103, 189, 0.9)', 
              'rgba(140, 86, 75, 0.6)',   
              'rgba(227, 119, 194, 0.9)', 
              'rgba(127, 127, 127, 0.6)', 
              'rgba(188, 189, 34, 0.9)',  
              'rgba(23, 190, 207, 0.6)'     
            ],
          }
        ]
      },
      options: {
        aspectRatio:2.5
      }
    });
  }

  getRandomColor(index: number): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.6)`; 
  }

  getTotalMinutes(): number {
    if (!this.userData) {
      return 0;
    }
    return this.userData.workouts.reduce((total, workout) => total + workout.minutes, 0);
  }
}
