/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Cob10Component } from './cob10.component';

describe('Cob10Component', () => {
  let component: Cob10Component;
  let fixture: ComponentFixture<Cob10Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cob10Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cob10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
