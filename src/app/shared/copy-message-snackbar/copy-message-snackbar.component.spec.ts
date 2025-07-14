import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyMessageSnackbarComponent } from './copy-message-snackbar.component';

describe('CopyMessageSnackbarComponent', () => {
  let component: CopyMessageSnackbarComponent;
  let fixture: ComponentFixture<CopyMessageSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopyMessageSnackbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CopyMessageSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
