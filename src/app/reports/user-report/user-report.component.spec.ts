import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { UserReportComponent } from './user-report.component';

describe('UserReportComponent', () => {
  let component: UserReportComponent;
  let fixture: ComponentFixture<UserReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserReportComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: {
              subscribe: (fn: (value: any) => void) => fn({
                username: 'johndoe'
              })
            }
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data from localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([{ id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] }]));
    component.ngOnInit();
    expect(component.username).toEqual('johndoe');
    expect(component.userData).toBeDefined();
    expect(component.userData?.name).toEqual('johndoe');
  });

  it('should calculate total minutes correctly', () => {
    component.userData = {
      id: 1,
      name: 'John Doe',
      workouts: [
        { type: 'Running', minutes: 30 },
        { type: 'Cycling', minutes: 45 }
      ]
    };

    const totalMinutes = component.getTotalMinutes();
    expect(totalMinutes).toEqual(75);
  });

});
