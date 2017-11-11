import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginWindComponent } from './login-wind.component';

describe('LoginWindComponent', () => {
  let component: LoginWindComponent;
  let fixture: ComponentFixture<LoginWindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginWindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginWindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
