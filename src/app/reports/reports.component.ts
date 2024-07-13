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
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
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
  
}
