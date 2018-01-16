import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgraphGraphComponent } from './ngraph-graph.component';

describe('NgraphGraphComponent', () => {
  let component: NgraphGraphComponent;
  let fixture: ComponentFixture<NgraphGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgraphGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgraphGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
