import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { ApproverPageComponent } from './pages/approver/approver-page.component';
import { BuyerPageComponent } from './pages/buyer/buyer-page.component';
import { RequisitionManagementRoutingModule } from './pages/requisition-management-routing.module';
import { RequisitionManagementStoreModule } from './store/requisition-management-store.module';

@NgModule({
  declarations: [ApproverPageComponent, BuyerPageComponent],
  imports: [RequisitionManagementRoutingModule, RequisitionManagementStoreModule, SharedModule],
})
export class RequisitionManagementModule {}