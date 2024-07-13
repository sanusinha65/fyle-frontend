import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ReportsComponent } from './reports.component';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let titleService: Title;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportsComponent],
      providers: [Title]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    titleService = TestBed.inject(Title);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set page title on initialization', () => {
    spyOn(titleService, 'setTitle').and.stub();

    component.ngOnInit();

    expect(titleService.setTitle).toHaveBeenCalledWith('Reports | Fyle');
  });

  it('should load user data from localStorage', () => {
    const userData = [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] },
      { id: 2, name: 'Jane Smith', workouts: [{ type: 'Cycling', minutes: 45 }] }
    ];
    localStorage.setItem('userData', JSON.stringify(userData));

    component.ngOnInit();

    expect(component.workOutUserData.length).toBe(2);
    expect(component.workOutUserData[0].name).toBe('John Doe');
    expect(component.workOutUserData[1].name).toBe('Jane Smith');
  });

  it('should generate report URL correctly', () => {
    const user = { id: 1, name: 'John Doe', workouts: [] };

    const url = component.getReportUrl(user);

    expect(url).toBe('/reports/johndoe');
  });

  it('should calculate total pages correctly', () => {
    component.workOutUserData = [
      { id: 1, name: 'User 1', workouts: [] },
      { id: 2, name: 'User 2', workouts: [] },
      { id: 3, name: 'User 3', workouts: [] },
      { id: 4, name: 'User 4', workouts: [] }
    ];

    expect(component.totalPages).toBe(1); // Assuming usersPerPage is 5 in this test case
  });

});
