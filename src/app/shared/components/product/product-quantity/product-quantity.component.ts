import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { AnyProductViewType } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-product-quantity',
  templateUrl: './product-quantity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductQuantityComponent implements OnChanges {
  @Input() type?: 'input' | 'select' | 'counter';
  @Input() id: string;

  product$: Observable<AnyProductViewType>;
  quantity$: Observable<number>;
  hasQuantityError$: Observable<boolean>;
  quantityError$: Observable<string>;

  constructor(private context: ProductContextFacade) {}

  ngOnChanges() {
    this.product$ = this.context.select('product');
    this.quantity$ = this.context.select('quantity').pipe(first());
    this.hasQuantityError$ = this.context.select('hasQuantityError');
    this.quantityError$ = this.context.select('quantityError');
  }

  change(target: EventTarget) {
    // tslint:disable-next-line: no-string-literal
    this.context.set('quantity', () => target['valueAsNumber']);
  }
}
