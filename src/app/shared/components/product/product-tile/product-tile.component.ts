import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { AnyProductViewType, ProductHelper } from 'ish-core/models/product/product.model';

export interface ProductTileComponentConfiguration {
  readOnly: boolean;
  displayName: boolean;
  displayVariations: boolean;
  displayPrice: boolean;
  displayPromotions: boolean;
  displayAddToBasket: boolean;
  displayAddToWishlist: boolean;
  displayAddToOrderTemplate: boolean;
  displayAddToCompare: boolean;
  displayAddToQuote: boolean;
}

@Component({
  selector: 'ish-product-tile',
  templateUrl: './product-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTileComponent implements OnChanges {
  @Input() configuration: Partial<ProductTileComponentConfiguration> = {};
  @Input() category: CategoryView;

  product$: Observable<AnyProductViewType>;

  isMasterProduct = ProductHelper.isMasterProduct;
  isVariationProduct = ProductHelper.isVariationProduct;

  constructor(private context: ProductContextFacade) {}

  ngOnChanges() {
    this.product$ = this.context.select('product');
  }

  variationCount(product: ProductView) {
    return product && ProductHelper.isMasterProduct(product) && product.variations() && product.variations().length;
  }
}
