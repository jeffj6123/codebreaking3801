import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayfairComponent } from './playfair.component';

describe('PlayfairComponent', () => {
  let component: PlayfairComponent;
  let fixture: ComponentFixture<PlayfairComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayfairComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayfairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
