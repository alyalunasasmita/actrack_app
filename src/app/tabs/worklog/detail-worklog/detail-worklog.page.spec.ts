import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailWorklogPage } from './detail-worklog.page';

describe('DetailWorklogPage', () => {
  let component: DetailWorklogPage;
  let fixture: ComponentFixture<DetailWorklogPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailWorklogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
