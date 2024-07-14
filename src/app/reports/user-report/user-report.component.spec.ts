import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js';
import { of } from 'rxjs';
import { UserReportComponent } from './user-report.component';
import { LocalStorageService } from '../../services/local-storage.service';

describe('UserReportComponent', () => {
  let component: UserReportComponent;
  let fixture: ComponentFixture<UserReportComponent>;
  let activatedRoute: ActivatedRoute;
  let titleService: Title;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;

  beforeEach(async () => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['getItem']);
    await TestBed.configureTestingModule({
      declarations: [UserReportComponent],
      imports: [FormsModule],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ username: 'johndoe' }) } },
        { provide: Title, useValue: jasmine.createSpyObj('Title', ['setTitle']) },
        { provide: LocalStorageService, useValue: localStorageSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserReportComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    titleService = TestBed.inject(Title);
    localStorageService = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set page title on initialization', () => {
    fixture.detectChanges();

    expect(titleService.setTitle).toHaveBeenCalledWith('Reports | Fyle');
  });

  it('should load user data from local storage on initialization', () => {
    const userData = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] }
    ];
    localStorageService.getItem.and.returnValue(JSON.stringify(userData));

    fixture.detectChanges();

    expect(localStorageService.getItem).toHaveBeenCalledWith('userData');
    expect(component.userData).toEqual(userData[0]);
    expect(titleService.setTitle).toHaveBeenCalledWith(`John Doe's Report  | Fyle`);
  });

  it('should handle missing user data in local storage', () => {
    localStorageService.getItem.and.returnValue(null);
    spyOn(console, 'error');

    fixture.detectChanges();

    expect(localStorageService.getItem).toHaveBeenCalledWith('userData');
    expect(component.userData).toBeNull();
    expect(console.error).toHaveBeenCalledWith('No userData found in localStorage.');
  });

  it('should handle user not found in local storage', () => {
    const userData = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] }
    ];
    localStorageService.getItem.and.returnValue(JSON.stringify(userData));
    activatedRoute.params = of({ username: 'janedoe' }); 

    spyOn(console, 'error');

    fixture.detectChanges();

    expect(localStorageService.getItem).toHaveBeenCalledWith('userData');
    expect(component.userData).toBeNull();
    expect(console.error).toHaveBeenCalledWith('User janedoe not found in localStorage data.');
  });

  it('should change chart type and reload data', () => {
    const userData = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] }
    ];
    localStorageService.getItem.and.returnValue(JSON.stringify(userData));
    spyOn(component, 'prepareChartData');

    fixture.detectChanges();

    const selectElement: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    selectElement.value = 'pie'; 
    selectElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();

    expect(component.chartType).toBe('pie');
    expect(component.prepareChartData).toHaveBeenCalled();
  });

  it('should calculate total workout minutes', () => {
    const userData = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }, { type: 'Swimming', minutes: 60 }] }
    ];
    localStorageService.getItem.and.returnValue(JSON.stringify(userData));

    fixture.detectChanges();

    const totalMinutes = component.getTotalMinutes();

    expect(totalMinutes).toBe(90);
  });
});
