import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbmComponent } from './cbm.component';

describe('CbmComponent', () => {
  let component: CbmComponent;
  let fixture: ComponentFixture<CbmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CbmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CbmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
