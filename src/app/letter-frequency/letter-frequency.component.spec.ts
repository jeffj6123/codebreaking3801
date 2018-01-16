import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterFrequencyComponent } from './letter-frequency.component';

describe('LetterFrequencyComponent', () => {
  let component: LetterFrequencyComponent;
  let fixture: ComponentFixture<LetterFrequencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterFrequencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
