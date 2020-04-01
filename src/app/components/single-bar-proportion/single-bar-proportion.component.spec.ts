import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleBarProportionComponent } from './single-bar-proportion.component';

describe('SingleBarProportionComponent', () => {
  let component: SingleBarProportionComponent;
  let fixture: ComponentFixture<SingleBarProportionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleBarProportionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleBarProportionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
