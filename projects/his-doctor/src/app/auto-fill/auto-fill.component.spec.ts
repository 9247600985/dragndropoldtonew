/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AutoFillComponent } from './auto-fill.component';

describe('AutoFillComponent', () => {
  let component: AutoFillComponent;
  let fixture: ComponentFixture<AutoFillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoFillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoFillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
