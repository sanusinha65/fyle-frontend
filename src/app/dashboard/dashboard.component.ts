import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

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
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  value: string = '';
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
  filteredUserDataForDisplay: User[] = [];
  searchText: string = '';
  uniqueWorkoutTypes: string[] = [];
  selectedName: string = 'all';
  currentPage: number = 1;
  usersPerPage: number = 5;
  perPageOptions: number[] = [5, 10, 25, 50, 100];

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Dashboard | Fyle');
    if (typeof localStorage === 'undefined') {
      console.error('localStorage is not available.');
      return;
    }
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
    this.paginateUsers();
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
    const searchTextLower = this.searchText.toLowerCase();
    this.filteredUserData = this.workOutUserData.filter(user => {
      const userNameLower = user.name.toLowerCase();
      const matchesName = userNameLower.includes(searchTextLower);
      const matchesType = this.selectedName === 'all' || user.workouts.some(workout => workout.type === this.selectedName);
      return matchesName && matchesType;
    });
    this.extractUniqueWorkoutTypes();
    this.currentPage = 1; 
    this.paginateUsers();
  }
  
  extractUniqueWorkoutTypes(): void {
    this.uniqueWorkoutTypes = [];
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
  
  paginateUsers(): void {
    const startIndex = (this.currentPage - 1) * this.usersPerPage;
    const endIndex = startIndex + this.usersPerPage;
    this.filteredUserDataForDisplay = this.filteredUserData.slice(startIndex, endIndex);
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateUsers();
    }
  }
  
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateUsers();
    }
  }
  
  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateUsers();
    }
  }
  
  onPerPageChange(event: any): void {
    this.usersPerPage = event.target.value;
    this.currentPage = 1; 
    this.paginateUsers(); 
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredUserData.length / this.usersPerPage);
  }

  getReportUrl(user: any): string {
    const userName = user.name.toLowerCase().replace(/\s+/g, '').split(',').join('');
    return `/reports/${userName}`;
  }
}