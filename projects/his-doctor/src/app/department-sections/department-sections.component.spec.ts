import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentSectionsComponent } from './department-sections.component';

describe('DepartmentSectionsComponent', () => {
  let component: DepartmentSectionsComponent;
  let fixture: ComponentFixture<DepartmentSectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentSectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
