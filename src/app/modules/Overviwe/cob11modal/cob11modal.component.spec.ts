/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Cob11modalComponent } from './cob11modal.component';

describe('Cob11modalComponent', () => {
  let component: Cob11modalComponent;
  let fixture: ComponentFixture<Cob11modalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cob11modalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Cob11modalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
