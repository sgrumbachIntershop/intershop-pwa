import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { AnyProductViewType, ProductHelper } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-product-detail-actions',
  templateUrl: './product-detail-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailActionsComponent implements OnInit {
  /**
   * TODO: to be removed once channelName information available in system
   */
  channelName = 'inTRONICS';

  isMasterProduct = ProductHelper.isMasterProduct;
  product$: Observable<AnyProductViewType>;

  constructor(@Inject(DOCUMENT) public document: Document, private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
  }

  addToCompare() {
    this.context.addToCompare();
  }
}
