import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasHolderComponent } from './gas-holder.component';

describe('GasHolderComponent', () => {
  let component: GasHolderComponent;
  let fixture: ComponentFixture<GasHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GasHolderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GasHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
