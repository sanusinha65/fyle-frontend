import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { LocalStorageService } from '../services/local-storage.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let titleService: Title;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;

  beforeEach(async () => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem']);
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [FormsModule],
      providers: [
        Title,
        { provide: LocalStorageService, useValue: localStorageSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    titleService = TestBed.inject(Title);
    localStorageService = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
  });

  afterEach(() => {
    localStorage.removeItem('userData'); // Clear local storage after each test
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set page title on initialization', () => {
    spyOn(titleService, 'setTitle').and.callThrough();

    component.ngOnInit();

    expect(titleService.setTitle).toHaveBeenCalledWith('Dashboard | Fyle');
  });

  it('should load user data from local storage on initialization', () => {
    const userData = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] }
    ];
    localStorageService.getItem.and.returnValue(JSON.stringify(userData));

    component.ngOnInit();

    expect(localStorageService.getItem).toHaveBeenCalledWith('userData');
    expect(component.workOutUserData).toEqual(userData);
  });

  it('should set dummy data to local storage if no data is present', () => {
    localStorageService.getItem.and.returnValue(null);

    component.ngOnInit();

    expect(localStorageService.setItem).toHaveBeenCalledWith('userData', JSON.stringify(component.dummyData));
    expect(component.workOutUserData).toEqual(component.dummyData);
  });

  it('should calculate workout data correctly', () => {
    component.workOutUserData = component.dummyData;

    component.calculateWorkoutData();

    expect(component.workoutUsers).toBe(3);
    expect(component.workoutTime).toBe(245);
    expect(component.workoutTypes).toBe(4);
  });

  it('should filter user data based on search text and workout type', () => {
    component.workOutUserData = component.dummyData;
    component.searchText = 'mike';
    component.selectedName = 'all';

    component.applyFilter();

    expect(component.filteredUserData.length).toBe(1);
    expect(component.filteredUserData[0].name).toBe('Mike Johnson');
  });

  it('should paginate user data correctly', () => {
    component.filteredUserData = component.dummyData;

    component.usersPerPage = 1;
    component.currentPage = 1;

    component.paginateUsers();

    expect(component.filteredUserDataForDisplay.length).toBe(1);
    expect(component.filteredUserDataForDisplay[0].name).toBe('John Doe');

    component.nextPage();

    expect(component.filteredUserDataForDisplay.length).toBe(1);
    expect(component.filteredUserDataForDisplay[0].name).toBe('Jane Smith');
  });

  it('should generate correct report URL', () => {
    const user = { name: 'John Doe' };

    const url = component.getReportUrl(user);

    expect(url).toBe('/reports/johndoe');
  });
});
