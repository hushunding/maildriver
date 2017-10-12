import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TransmitListComponent } from "./transmit-list.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("TransmitListComponent", () => {

  let fixture: ComponentFixture<TransmitListComponent>;
  let component: TransmitListComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [TransmitListComponent]
    });

    fixture = TestBed.createComponent(TransmitListComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
