import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BofgComponent } from './bofg.component';

describe('BofgComponent', () => {
  let component: BofgComponent;
  let fixture: ComponentFixture<BofgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BofgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BofgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
