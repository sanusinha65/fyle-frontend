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
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.css'
})

export class WorkoutComponent implements OnInit {
  workOutUserData: User[] = [];
  constructor(private titleService: Title) { }
  ngOnInit(): void {
    this.titleService.setTitle('Workout | Fyle');
    const localStorageData = localStorage.getItem('userData');
    if (localStorageData) {
      const storedUserData = JSON.parse(localStorageData);
      this.workOutUserData.push(...storedUserData);
    }
  }
  // making report url so that the users can directly check their report from their
  getReportUrl(user: any): string {
    const userName = user.name.toLowerCase().replace(/\s+/g, '').split(',').join('');
    return `/reports/${userName}`;
  }
  // for form 
  workOutUserName: string = '';
  workoutTypesList: string[] = ['Running', 'Cycling', 'Swimming', 'Yoga', 'Walking', 'Gym'];
  workOutType: string = this.workoutTypesList[0];
  workOutMin: number | null = null;
  // form var -- ends here

  // for pagination 
  currentPage: number = 1;
  usersPerPage: number = 5;

  // pagination functions 
  getPaginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.usersPerPage;
    return this.workOutUserData.slice(startIndex, startIndex + this.usersPerPage);
  }

  nextPage() {
    if (this.currentPage * this.usersPerPage < this.workOutUserData.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.workOutUserData.length / this.usersPerPage);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  // pagination functions  -- ends here 
  
  // for adding workout in the localstorage
  addWorkout() {
    const userName = this.workOutUserName.trim();
    const workoutType = this.workOutType;
    const workoutMinutes = this.workOutMin;

    if (!userName || !workoutType || workoutMinutes === null) {
      alert('Please fill all the fields');
      return;
    }

    const existingUser = this.workOutUserData.find(user => user.name.toLowerCase() === userName.toLowerCase());

    if (existingUser) {
      existingUser.workouts.push({ type: workoutType, minutes: workoutMinutes });
    } else {
      const newUser: User = {
        id: this.workOutUserData.length + 1,
        name: userName,
        workouts: [{ type: workoutType, minutes: workoutMinutes }]
      };
      this.workOutUserData.push(newUser);
    }
    localStorage.setItem('userData', JSON.stringify(this.workOutUserData));
    this.resetForm();
  }
  // for resetting the form once it is added. 
  resetForm() {
    this.workOutUserName = '';
    this.workOutType = this.workoutTypesList[0];
    this.workOutMin = null;
  }
}
