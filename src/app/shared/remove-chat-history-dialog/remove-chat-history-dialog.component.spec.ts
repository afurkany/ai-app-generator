import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveChatHistoryDialogComponent } from './remove-chat-history-dialog.component';

describe('RemoveChatHistoryDialogComponent', () => {
  let component: RemoveChatHistoryDialogComponent;
  let fixture: ComponentFixture<RemoveChatHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveChatHistoryDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RemoveChatHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
