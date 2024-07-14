import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '../services/local-storage.service';
import { WorkoutComponent } from './workout.component';

describe('WorkoutComponent', () => {
  let component: WorkoutComponent;
  let fixture: ComponentFixture<WorkoutComponent>;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;

  beforeEach(async () => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem']);

    await TestBed.configureTestingModule({
      declarations: [WorkoutComponent],
      imports: [FormsModule],
      providers: [
        Title,
        { provide: LocalStorageService, useValue: localStorageSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutComponent);
    component = fixture.componentInstance;
    localStorageService = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set page title on initialization', () => {
    const titleService = TestBed.inject(Title);
    spyOn(titleService, 'setTitle').and.callThrough();

    component.ngOnInit();

    expect(titleService.setTitle).toHaveBeenCalledWith('Workout | Fyle');
  });

  it('should load user data from local storage on initialization', () => {
    const userData = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] }
    ];
    localStorageService.getItem.and.returnValue(JSON.stringify(userData));

    component.ngOnInit();

    expect(localStorageService.getItem).toHaveBeenCalledWith('userData');
    expect(component.workOutUserData.length).toBe(1);
    expect(component.workOutUserData[0].name).toBe('John Doe');
  });

  it('should add a new workout to the user', () => {
    const initialUserData = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] }
    ];
    component.workOutUserData = initialUserData;
    const userName = 'Jane Smith';
    const workoutType = 'Swimming';
    const workoutMinutes = 45;

    component.workOutUserName = userName;
    component.workOutType = workoutType;
    component.workOutMin = workoutMinutes;

    component.addWorkout();

    expect(component.workOutUserData.length).toBe(2);
    expect(component.workOutUserData[1].name).toBe(userName);
    expect(component.workOutUserData[1].workouts.length).toBe(1);
    expect(component.workOutUserData[1].workouts[0].type).toBe(workoutType);
    expect(component.workOutUserData[1].workouts[0].minutes).toBe(workoutMinutes);
  });

  it('should reset the form after adding a workout', () => {
    component.workOutUserName = 'John Doe';
    component.workOutType = 'Running';
    component.workOutMin = 30;

    component.resetForm();

    expect(component.workOutUserName).toBe('');
    expect(component.workOutType).toBe('Running');
    expect(component.workOutMin).toBeNull();
  });

});

