import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueDisplayComponent } from './value-display.component';

describe('ValueDisplayComponent', () => {
  let component: ValueDisplayComponent;
  let fixture: ComponentFixture<ValueDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
