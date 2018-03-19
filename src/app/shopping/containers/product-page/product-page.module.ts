import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ProductDetailComponent } from '../../components/product/product-detail/product-detail.component';
import { ShoppingSharedModule } from '../../shopping-shared.module';
import { ProductPageContainerComponent } from './product-page.container';
import { productPageRoutes } from './product-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(productPageRoutes),
    SharedModule,
    ShoppingSharedModule
  ],
  providers: [],
  declarations: [
    ProductPageContainerComponent,
    ProductDetailComponent
  ]
})

export class ProductPageModule { }