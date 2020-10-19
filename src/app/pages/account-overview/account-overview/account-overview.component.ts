import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';

/**
 * The Account Overview Page Component displays the account overview dashboard of the user's 'MyAccount' section. See also {@link OrderOverviewPageContainerComponent}
 *
 * @example
 * <ish-account-overview-page [user]="user$ | async"></ish-account-overview-page>
 */
@Component({
  selector: 'ish-account-overview',
  templateUrl: './account-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOverviewComponent implements OnInit {
  @Input() user: User;
  @Input() customer: Customer;

  isOrderApprovalEnabled$: Observable<boolean>;

  constructor(private appFacade: AppFacade) {}

  ngOnInit() {
    this.isOrderApprovalEnabled$ = this.appFacade.orderApprovalEnabled$;
  }
}
