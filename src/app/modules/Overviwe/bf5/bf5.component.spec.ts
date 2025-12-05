import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bf5Component } from './bf5.component';

describe('Bf5Component', () => {
  let component: Bf5Component;
  let fixture: ComponentFixture<Bf5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bf5Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Bf5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
