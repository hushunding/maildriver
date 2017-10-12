import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FileExplorerComponent } from "./file-explorer.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("FileExplorerComponent", () => {

  let fixture: ComponentFixture<FileExplorerComponent>;
  let component: FileExplorerComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [FileExplorerComponent]
    });

    fixture = TestBed.createComponent(FileExplorerComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
