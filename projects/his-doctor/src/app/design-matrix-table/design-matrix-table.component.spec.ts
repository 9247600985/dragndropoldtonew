/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DesignMatrixTableComponent } from './design-matrix-table.component';

describe('DesignMatrixTableComponent', () => {
  let component: DesignMatrixTableComponent;
  let fixture: ComponentFixture<DesignMatrixTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignMatrixTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignMatrixTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
