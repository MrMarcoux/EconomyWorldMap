import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryNameDisplayComponent } from './country-name-display.component';

describe('CountryNameDisplayComponent', () => {
  let component: CountryNameDisplayComponent;
  let fixture: ComponentFixture<CountryNameDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryNameDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryNameDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
