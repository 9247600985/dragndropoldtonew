/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HdrnavBarComponent } from './hdrnav-bar.component';

describe('HdrnavBarComponent', () => {
  let component: HdrnavBarComponent;
  let fixture: ComponentFixture<HdrnavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HdrnavBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HdrnavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
