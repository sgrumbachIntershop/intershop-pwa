import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, startWith } from 'rxjs/operators';

import { PriceItemHelper } from 'ish-core/models/price-item/price-item.helper';
import { Price, PriceHelper } from 'ish-core/models/price/price.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';

@Component({
  selector: 'ish-requisition-widget',
  templateUrl: './requisition-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class RequisitionWidgetComponent implements OnInit {
  numPendingRequisitions$: Observable<number>;
  totalAmountRequisitons$: Observable<Price>;

  requisitionsLoading$: Observable<boolean>;

  constructor(private requisitionFacade: RequisitionManagementFacade) {}

  ngOnInit() {
    const pendingRequisitions$ = this.requisitionFacade.buyerPendingRequisitions$().pipe(
      filter(reqs => reqs.length > 0),
      shareReplay(1)
    );

    this.numPendingRequisitions$ = pendingRequisitions$.pipe(
      startWith([]),
      map(reqs => reqs?.length)
    );
    this.totalAmountRequisitons$ = pendingRequisitions$.pipe(
      map(reqs => reqs?.map(req => PriceItemHelper.selectType(req.totals?.total, 'gross'))),
      map(prices =>
        prices?.reduce((curr: Price, acc: Price) => PriceHelper.sum(curr, acc), {
          type: 'Money',
          value: 0,
          currency: prices?.[0].currency,
        })
      )
    );

    this.requisitionsLoading$ = this.requisitionFacade.requisitionsLoading$;
  }
}
