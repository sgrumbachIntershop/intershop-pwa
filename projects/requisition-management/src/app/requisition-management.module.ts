import { NgModule } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from 'ish-shared/shared.module';

import { RequisitionBuyerApprovalComponent } from './components/requisition/requisition-buyer-approval/requisition-buyer-approval.component';
import { RequisitionSummaryComponent } from './components/requisition/requisition-summary/requisition-summary.component';
import { RequisitionsListComponent } from './components/requisition/requisitions-list/requisitions-list.component';
import { ApproverPageComponent } from './pages/approver/approver-page.component';
import { BuyerPageComponent } from './pages/buyer/buyer-page.component';
import { RequisitionDetailPageComponent } from './pages/requisition-detail/requisition-detail-page.component';
import { RequisitionManagementRoutingModule } from './pages/requisition-management-routing.module';
import { RequisitionManagementStoreModule } from './store/requisition-management-store.module';

@NgModule({
  declarations: [
    ApproverPageComponent,
    BuyerPageComponent,
    RequisitionBuyerApprovalComponent,
    RequisitionDetailPageComponent,
    RequisitionSummaryComponent,
    RequisitionsListComponent,
  ],
  imports: [
    NgbNavModule,
    RequisitionManagementRoutingModule,
    RequisitionManagementStoreModule,
    SharedModule,
  ],
})
export class RequisitionManagementModule {}
