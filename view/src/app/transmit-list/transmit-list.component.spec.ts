import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmitListComponent } from './transmit-list.component';

describe('TransmitListComponent', () => {
  let component: TransmitListComponent;
  let fixture: ComponentFixture<TransmitListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransmitListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
