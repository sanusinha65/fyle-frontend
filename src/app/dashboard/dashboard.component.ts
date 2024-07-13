import { Component, OnInit } from '@angular/core';
import { Title} from '@angular/platform-browser';

interface Workout {
  type: string;
  minutes: number;
}

interface User {
  id: number;
  name: string;
  workouts: Workout[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  value: string = ''; 
  title = 'fyle-assignment';
  workoutUsers = 0;
  workoutTime = 0;
  workoutTypes = 0;
  workOutUserData: User[] = [];
  dummyData: User[] = [
    {
      id: 1,
      name: 'John Doe',
      workouts: [
        { type: 'Running', minutes: 30 },
        { type: 'Cycling', minutes: 45 }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      workouts: [
        { type: 'Swimming', minutes: 60 },
        { type: 'Running', minutes: 20 }
      ]
    },
    {
      id: 3,
      name: 'Mike Johnson',
      workouts: [
        { type: 'Yoga', minutes: 50 },
        { type: 'Cycling', minutes: 40 }
      ]
    }
  ];

  filteredUserData: User[] = [];
  searchText: string = '';
  uniqueWorkoutTypes: string[] = [];
  selectedName: string ='all';

  constructor(private titleService: Title) { }
  ngOnInit(): void {
    this.titleService.setTitle('Dashboard | Fyle');
    const localStorageData = localStorage.getItem('userData');
    if (localStorageData) {
      const storedUserData = JSON.parse(localStorageData);
      this.workOutUserData.push(...storedUserData);
    } else {
      localStorage.setItem('userData', JSON.stringify(this.dummyData));
      this.workOutUserData.push(...this.dummyData);
    }
    this.filteredUserData = this.workOutUserData;
    this.extractUniqueWorkoutTypes();
    this.calculateWorkoutData();
  }

  calculateWorkoutData() {
    this.workoutUsers = this.workOutUserData.length;

    const workoutTypesSet = new Set<string>();
    this.workOutUserData.forEach(user => {
      user.workouts.forEach(workout => {
        this.workoutTime += workout.minutes;
        workoutTypesSet.add(workout.type);
      });
    });

    this.workoutTypes = workoutTypesSet.size;
  }

  getTotalWorkoutMinutes(workouts: { type: string, minutes: number }[]): number {
    return workouts.reduce((total, workout) => total + workout.minutes, 0);
  }

  applyFilter(): void {
    this.filteredUserData = this.workOutUserData.filter(user => {
      const matchesName = user.name.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesType = this.selectedName === 'all' || user.workouts.some(workout => workout.type === this.selectedName);
      return matchesName && matchesType;
    });
    this.extractUniqueWorkoutTypes()
  }

  extractUniqueWorkoutTypes(): void {
    this.uniqueWorkoutTypes=[];
    const seen = new Set<string>();
    this.filteredUserData.forEach(user => {
      user.workouts.forEach(workout => {
        if (!seen.has(workout.type)) {
          seen.add(workout.type);
          this.uniqueWorkoutTypes.push(workout.type);
        }
      });
    });
  }
}
