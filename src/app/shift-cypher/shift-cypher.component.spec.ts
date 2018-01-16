import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftCypherComponent } from './shift-cypher.component';

describe('ShiftCypherComponent', () => {
  let component: ShiftCypherComponent;
  let fixture: ComponentFixture<ShiftCypherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftCypherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftCypherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
