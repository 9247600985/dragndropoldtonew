/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IconsGridComponent } from './icons-grid.component';

describe('IconsGridComponent', () => {
  let component: IconsGridComponent;
  let fixture: ComponentFixture<IconsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
