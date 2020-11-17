import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { RxState } from '@rx-angular/state';
import { isEqual } from 'lodash-es';
import { combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, first, map, startWith, switchMap, tap } from 'rxjs/operators';

import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import { VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { AnyProductViewType, ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { addProductToBasket } from 'ish-core/store/customer/basket';
import { addToCompare, isInCompareProducts, toggleCompare } from 'ish-core/store/shopping/compare';
import { getProduct, loadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { whenTruthy } from 'ish-core/utils/operators';

@Injectable()
export class ProductContextFacade extends RxState<{
  sku: string;
  requiredCompletenessLevel: ProductCompletenessLevel;
  product: AnyProductViewType;
  productAsVariationProduct: VariationProductView;
  loading: boolean;
  isInCompareList: boolean;
  quantity: number;
  quantityError: string;
  hasQuantityError: boolean;
}> {
  constructor(private store: Store, private translate: TranslateService) {
    super();

    this.set('requiredCompletenessLevel', () => ProductCompletenessLevel.List);

    this.connect(
      combineLatest([
        this.select('sku').pipe(whenTruthy()),
        this.select('requiredCompletenessLevel').pipe(whenTruthy()),
      ]).pipe(
        filter(([sku, level]) => !!sku && !!level),
        tap(([sku, level]) => store.dispatch(loadProductIfNotLoaded({ sku, level }))),
        switchMap(([sku, level]) =>
          store.pipe(
            select(getProduct, { sku }),
            filter(p => ProductHelper.isReadyForDisplay(p, level)),
            map(product => ({ product, loading: false })),
            startWith({ loading: true })
          )
        )
      )
    );

    this.connect('productAsVariationProduct', this.select('product').pipe(filter(ProductHelper.isVariationProduct)));

    this.connect(
      'isInCompareList',
      this.select('sku').pipe(switchMap(sku => this.store.pipe(select(isInCompareProducts(sku)))))
    );

    this.connect(
      combineLatest([this.select('product'), this.select('quantity').pipe(distinctUntilChanged())]).pipe(
        map(([product, quantity]) => {
          if (product) {
            if (Number.isNaN(quantity)) {
              return this.translate.instant('product.quantity.integer.text');
            } else if (quantity < product.minOrderQuantity) {
              return this.translate.instant('product.quantity.greaterthan.text', { 0: product.minOrderQuantity });
            } else if (quantity > product.maxOrderQuantity) {
              return this.translate.instant('product.quantity.lessthan.text', { 0: product.maxOrderQuantity });
            }
          }
          return;
        }),
        map(quantityError => ({
          quantityError,
          hasQuantityError: !!quantityError,
        })),
        distinctUntilChanged(isEqual)
      )
    );

    this.connect(
      'quantity',
      this.select('product').pipe(
        whenTruthy(),
        map(p => p.minOrderQuantity),
        first()
      ),
      (state, minOrderQuantity) => (state.quantity ??= minOrderQuantity)
    );

    // tslint:disable-next-line: no-console
    this.hold(this.$, ctx => console.log(ctx));
  }

  changeVariationOption(name: string, value: string) {
    this.set('sku', () =>
      ProductVariationHelper.findPossibleVariation(name, value, this.get('productAsVariationProduct'))
    );
  }

  addToBasket() {
    this.store.dispatch(addProductToBasket({ sku: this.get('sku'), quantity: this.get('quantity') }));
  }

  toggleCompare() {
    this.store.dispatch(toggleCompare({ sku: this.get('sku') }));
  }

  addToCompare() {
    this.store.dispatch(addToCompare({ sku: this.get('sku') }));
  }
}
