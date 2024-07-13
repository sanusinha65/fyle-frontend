import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let titleService: Title;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set page title on initialization', () => {
    spyOn(titleService, 'setTitle').and.stub();

    component.ngOnInit();

    expect(titleService.setTitle).toHaveBeenCalledWith('Reports | Fyle');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
