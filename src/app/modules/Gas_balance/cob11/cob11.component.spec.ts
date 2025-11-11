import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cob11Component } from './cob11.component';

describe('Cob11Component', () => {
  let component: Cob11Component;
  let fixture: ComponentFixture<Cob11Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Cob11Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Cob11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
