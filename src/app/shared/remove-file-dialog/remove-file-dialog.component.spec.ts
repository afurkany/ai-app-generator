import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveFileDialogComponent } from './remove-file-dialog.component';

describe('RemoveFileDialogComponent', () => {
  let component: RemoveFileDialogComponent;
  let fixture: ComponentFixture<RemoveFileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveFileDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RemoveFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
