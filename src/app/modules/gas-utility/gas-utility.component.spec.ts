import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasUtilityComponent } from './gas-utility.component';

describe('GasUtilityComponent', () => {
  let component: GasUtilityComponent;
  let fixture: ComponentFixture<GasUtilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GasUtilityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GasUtilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
