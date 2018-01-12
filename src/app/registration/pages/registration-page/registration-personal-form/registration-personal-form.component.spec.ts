import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { RegistrationPersonalFormComponent } from './registration-personal-form.component';

describe('RegistrationPersonalFormComponent', () => {
  let component: RegistrationPersonalFormComponent;
  let fixture: ComponentFixture<RegistrationPersonalFormComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationPersonalFormComponent],
      providers: [
        { provide: TranslateService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(RegistrationPersonalFormComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const parentForm = new FormGroup({
          preferredLanguage: new FormControl(),
          birthday: new FormControl()
        });
        component.parentForm = parentForm;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });

  it('should throw an error if input parameter parentForm is not set', () => {
    component.parentForm = null;
    expect(function() { fixture.detectChanges(); }).toThrow();
  });

  it('should throw an error if control preferredLanguage does not exist', () => {
    component.parentForm.removeControl('preferredLanguage');
    expect(function() { fixture.detectChanges(); }).toThrowError(/.*required.*preferredLanguage.*/);
  });

  it('should throw an error if control birthday does not exist', () => {
    component.parentForm.removeControl('birthday');
    expect(function() { fixture.detectChanges(); }).toThrowError(/.*required.*birthday.*/);
  });

});
