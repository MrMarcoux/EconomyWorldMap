import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SITC2ProductsDisplayComponent } from './sitc2-products-display.component';

describe('SITC2ProductsDisplayComponent', () => {
  let component: SITC2ProductsDisplayComponent;
  let fixture: ComponentFixture<SITC2ProductsDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SITC2ProductsDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SITC2ProductsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
