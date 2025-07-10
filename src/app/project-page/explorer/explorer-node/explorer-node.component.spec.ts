import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerNodeComponent } from './explorer-node.component';

describe('ExplorerNodeComponent', () => {
  let component: ExplorerNodeComponent;
  let fixture: ComponentFixture<ExplorerNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorerNodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExplorerNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
