import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDocumentsDialogComponent } from './project-documents-dialog.component';

describe('ProjectDocumentsDialogComponent', () => {
  let component: ProjectDocumentsDialogComponent;
  let fixture: ComponentFixture<ProjectDocumentsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectDocumentsDialogComponent]
    });
    fixture = TestBed.createComponent(ProjectDocumentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
