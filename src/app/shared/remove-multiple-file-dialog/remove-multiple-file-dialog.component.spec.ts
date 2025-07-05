import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveMultipleFileDialogComponent } from './remove-multiple-file-dialog.component';

describe('RemoveMultipleFileDialogComponent', () => {
  let component: RemoveMultipleFileDialogComponent;
  let fixture: ComponentFixture<RemoveMultipleFileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveMultipleFileDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RemoveMultipleFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
