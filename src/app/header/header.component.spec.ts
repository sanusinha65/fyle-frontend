import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule]  // Import RouterTestingModule here
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a logo', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const logoElement = compiled.querySelector('#logo img');
    expect(logoElement).toBeTruthy();
    expect(logoElement?.getAttribute('src')).toContain('fylelogo.svg'); 
    expect(logoElement?.getAttribute('width')).toBe('100px'); 
  });

  it('should have a navigation menu', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('nav')).toBeTruthy();
    expect(compiled.querySelectorAll('nav a').length).toBeGreaterThan(0);
  });
});
