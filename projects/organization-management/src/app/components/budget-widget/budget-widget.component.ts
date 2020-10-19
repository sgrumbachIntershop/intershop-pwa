import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';
import { UserBudgets } from '../../models/user-budgets/user-budgets.model';

@Component({
  selector: 'ish-budget-widget',
  templateUrl: './budget-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetWidgetComponent implements OnInit {
  requisitionUserBudgets$: Observable<UserBudgets>;
  usersLoading$: Observable<boolean>;

  constructor(private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit() {
    this.requisitionUserBudgets$ = this.organizationManagementFacade
      .loggedInUser$()
      .pipe(map((user: B2bUser) => user?.budgets));
    this.usersLoading$ = this.organizationManagementFacade.usersLoading$;
  }
}
