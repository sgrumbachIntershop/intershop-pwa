import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';

import { WishlistsFacade } from '../../../facades/wishlists.facade';
import { Wishlist, WishlistItem } from '../../../models/wishlist/wishlist.model';

/**
 * The Wishlist item component displays a wishlist item. This Item can be removed or moved to another wishlist.
 */
@Component({
  selector: 'ish-account-wishlist-detail-line-item',
  templateUrl: './account-wishlist-detail-line-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountWishlistDetailLineItemComponent implements OnChanges {
  constructor(private productFacade: ShoppingFacade, private wishlistsFacade: WishlistsFacade) {}

  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;
  @Input() wishlistItemData: WishlistItem;
  @Input() currentWishlist: Wishlist;

  product$: Observable<ProductView>;

  isVariationProduct = ProductHelper.isVariationProduct;

  ngOnChanges(s: SimpleChanges) {
    if (s.wishlistItemData) {
      this.loadProductDetails();
    }
  }

  moveItemToOtherWishlist(sku: string, wishlistMoveData: { id: string; title: string }) {
    if (wishlistMoveData.id) {
      this.wishlistsFacade.moveItemToWishlist(this.currentWishlist.id, wishlistMoveData.id, sku);
    } else {
      this.wishlistsFacade.moveItemToNewWishlist(this.currentWishlist.id, wishlistMoveData.title, sku);
    }
  }

  removeProductFromWishlist(sku: string) {
    this.wishlistsFacade.removeProductFromWishlist(this.currentWishlist.id, sku);
  }

  /**if the wishlistItem is loaded, get product details*/
  private loadProductDetails() {
    if (!this.product$) {
      this.product$ = this.productFacade.product$(
        this.wishlistItemData.sku,
        AccountWishlistDetailLineItemComponent.REQUIRED_COMPLETENESS_LEVEL
      );
    }
  }
}
