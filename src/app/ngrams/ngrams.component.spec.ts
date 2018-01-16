import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgramsComponent } from './ngrams.component';

describe('NgramsComponent', () => {
  let component: NgramsComponent;
  let fixture: ComponentFixture<NgramsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgramsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
