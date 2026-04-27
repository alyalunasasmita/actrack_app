import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddworklogPage } from './addworklog.page';

describe('AddworklogPage', () => {
  let component: AddworklogPage;
  let fixture: ComponentFixture<AddworklogPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddworklogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
