import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExplorerComponent } from './file-explorer.component';
import { MatToolbar, MatButton, MatToolbarModule, MatButtonModule, MatTableModule, MatChipsModule } from '@angular/material';

describe('FileExplorerComponent', () => {
  let component: FileExplorerComponent;
  let fixture: ComponentFixture<FileExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileExplorerComponent ],
      imports:[MatToolbarModule, MatButtonModule, MatTableModule, MatChipsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
