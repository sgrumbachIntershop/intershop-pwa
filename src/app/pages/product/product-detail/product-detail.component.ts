import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { AnyProductViewType, ProductHelper, ProductPrices } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit {
  @Input() price: ProductPrices;

  product$: Observable<AnyProductViewType>;

  isVariationProduct = ProductHelper.isVariationProduct;
  isMasterProduct = ProductHelper.isMasterProduct;
  isRetailSet = ProductHelper.isRetailSet;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
  }
}
