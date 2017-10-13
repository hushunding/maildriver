import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManComponent } from './user-man.component';

describe('UserManComponent', () => {
  let component: UserManComponent;
  let fixture: ComponentFixture<UserManComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserManComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
