import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutComponent } from './workout.component';
import { LocalStorageService } from '../services/local-storage.service';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

class MockLocalStorageService {
  private storage = new Map<string, string>();

  getItem(key: string): string | null {
    return this.storage.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }

  clear(): void {
    this.storage.clear();
  }
}

describe('WorkoutComponent', () => {
  let component: WorkoutComponent;
  let fixture: ComponentFixture<WorkoutComponent>;
  let localStorageService: MockLocalStorageService;
  let titleService: Title;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkoutComponent],
      imports: [FormsModule],
      providers: [
        Title,
        { provide: LocalStorageService, useClass: MockLocalStorageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutComponent);
    component = fixture.componentInstance;
    localStorageService = TestBed.inject(LocalStorageService) as unknown as MockLocalStorageService;
    fixture.detectChanges();
    titleService = TestBed.inject(Title);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set page title on initialization', () => {
    spyOn(titleService, 'setTitle').and.stub();

    component.ngOnInit();

    expect(titleService.setTitle).toHaveBeenCalledWith('Workout | Fyle');
  });


  it('should initialize with data from localStorage', () => {
    const dummyData = [
      {
        id: 1,
        name: 'John Doe',
        workouts: [{ type: 'Running', minutes: 30 }]
      }
    ];
    localStorageService.setItem('userData', JSON.stringify(dummyData));
    component.ngOnInit();
    expect(component.workOutUserData.length).toBe(1);
    expect(component.workOutUserData[0].name).toBe('John Doe');
  });

  it('should generate correct report URL', () => {
    const user = { name: 'John Doe' };
    const reportUrl = component.getReportUrl(user);
    expect(reportUrl).toBe('/reports/johndoe');
  });

  it('should add a new workout', () => {
    component.workOutUserName = 'Jane Doe';
    component.workOutType = 'Yoga';
    component.workOutMin = 60;

    component.addWorkout();
    expect(component.workOutUserData.length).toBe(1);
    expect(component.workOutUserData[0].name).toBe('Jane Doe');
    expect(component.workOutUserData[0].workouts.length).toBe(1);
    expect(component.workOutUserData[0].workouts[0].type).toBe('Yoga');
    expect(component.workOutUserData[0].workouts[0].minutes).toBe(60);
  });

  it('should append a workout to an existing user', () => {
    const existingUser = {
      id: 1,
      name: 'John Doe',
      workouts: [{ type: 'Running', minutes: 30 }]
    };
    localStorageService.setItem('userData', JSON.stringify([existingUser]));
    component.ngOnInit();

    component.workOutUserName = 'John Doe';
    component.workOutType = 'Cycling';
    component.workOutMin = 45;

    component.addWorkout();
    expect(component.workOutUserData.length).toBe(1);
    expect(component.workOutUserData[0].workouts.length).toBe(2);
    expect(component.workOutUserData[0].workouts[1].type).toBe('Cycling');
    expect(component.workOutUserData[0].workouts[1].minutes).toBe(45);
  });

  it('should reset the form after adding a workout', () => {
    component.workOutUserName = 'Jane Doe';
    component.workOutType = 'Yoga';
    component.workOutMin = 60;

    component.addWorkout();
    expect(component.workOutUserName).toBe('');
    expect(component.workOutType).toBe('Running');
    expect(component.workOutMin).toBeNull();
  });

  it('should handle pagination correctly', () => {
    component.workOutUserData = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      workouts: [{ type: 'Running', minutes: 30 }]
    }));
    component.usersPerPage = 5;

    expect(component.totalPages).toBe(3);

    component.setPage(2);
    expect(component.currentPage).toBe(2);
    expect(component.getPaginatedUsers().length).toBe(5);

    component.nextPage();
    expect(component.currentPage).toBe(3);
    expect(component.getPaginatedUsers().length).toBe(2);

    component.prevPage();
    expect(component.currentPage).toBe(2);
    expect(component.getPaginatedUsers().length).toBe(5);
  });

  it('should alert when form fields are not filled', () => {
    spyOn(window, 'alert');
    component.workOutUserName = '';
    component.workOutType = 'Running';
    component.workOutMin = null;

    component.addWorkout();
    expect(window.alert).toHaveBeenCalledWith('Please fill all the fields');
  });
});
