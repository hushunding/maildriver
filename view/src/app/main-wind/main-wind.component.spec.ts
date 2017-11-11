import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainWindComponent } from './main-wind.component';

describe('MainWindComponent', () => {
  let component: MainWindComponent;
  let fixture: ComponentFixture<MainWindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainWindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainWindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
