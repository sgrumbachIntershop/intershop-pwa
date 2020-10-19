import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';
import { UserBudgetComponent } from '../user-budget/user-budget.component';

import { BudgetWidgetComponent } from './budget-widget.component';

describe('Budget Widget Component', () => {
  let component: BudgetWidgetComponent;
  let fixture: ComponentFixture<BudgetWidgetComponent>;
  let element: HTMLElement;

  let organizationManagementFacade: OrganizationManagementFacade;

  const user = { firstName: 'Jack', lastName: 'Link', name: 'Jack Link', email: 'jlink@test.intershop.de' } as B2bUser;

  beforeEach(async () => {
    organizationManagementFacade = mock(OrganizationManagementFacade);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        BudgetWidgetComponent,
        MockComponent(InfoBoxComponent),
        MockComponent(LoadingComponent),
        MockComponent(UserBudgetComponent),
      ],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetWidgetComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(organizationManagementFacade.loggedInUser$()).thenReturn(of(user));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render loading component if budgets loading', () => {
    when(organizationManagementFacade.usersLoading$).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });
});
