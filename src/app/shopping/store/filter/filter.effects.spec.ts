import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { anyString, anything, mock, verify } from 'ts-mockito';
import { instance, when } from 'ts-mockito/lib/ts-mockito';
import { CategoryView } from '../../../models/category-view/category-view.model';
import { Category } from '../../../models/category/category.model';
import { FilterNavigation } from '../../../models/filter-navigation/filter-navigation.model';
import { categoryTree } from '../../../utils/dev/test-data-utils';
import { FilterService } from '../../services/filter/filter.service';
import { LoadCategorySuccess, SelectCategory } from '../categories/categories.actions';
import { SelectProduct } from '../products/products.actions';
import { SearchProductsSuccess } from '../search';
import { ShoppingState } from '../shopping.state';
import { shoppingReducers } from '../shopping.system';
import * as fromActions from './filter.actions';
import { FilterEffects } from './filter.effects';

describe('FilterEffects', () => {
  let actions$: Observable<Action>;
  let effects: FilterEffects;
  let store$: Store<ShoppingState>;
  let filterServiceMock: FilterService;

  const router = mock(Router);
  const filterNav = {
    filter: [{ name: 'blubb', displayType: 'text_clear', facets: [{ name: 'a' }, { name: 'b' }] }],
  } as FilterNavigation;
  beforeEach(() => {
    filterServiceMock = mock(FilterService);
    when(filterServiceMock.getFilterForSearch(anything())).thenCall(a => {
      if (a === 'invalid') {
        return _throw({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of(filterNav);
      }
    });
    when(filterServiceMock.getFilterForCategory(anything())).thenCall(a => {
      if (a.name === 'invalid') {
        return _throw({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of(filterNav);
      }
    });

    when(filterServiceMock.getProductSkusForFilter(anything(), anything())).thenCall((a, b) => {
      if (a.name === 'invalid') {
        return _throw({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of(['123', '234']);
      }
    });

    when(filterServiceMock.applyFilter(anyString(), anyString())).thenCall((a, b) => {
      if (a === 'invalid') {
        return _throw({ message: 'invalid' } as HttpErrorResponse);
      } else {
        return of(filterNav);
      }
    });
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
        }),
      ],
      providers: [
        FilterEffects,
        provideMockActions(() => actions$),
        { provide: FilterService, useFactory: () => instance(filterServiceMock) },
        { provide: Router, useFactory: () => instance(router) },
      ],
    });

    effects = TestBed.get(FilterEffects);
    store$ = TestBed.get(Store);
  });

  describe('loadAvailableFilterForCategories$', () => {
    it('should call the filterService for LoadFilterForCategories action', () => {
      const action = new fromActions.LoadFilterForCategory({ name: 'c' } as Category);
      actions$ = hot('-a', { a: action });

      effects.loadAvailableFilterForCategories$.subscribe(() => {
        verify(filterServiceMock.getFilterForCategory(anything())).once();
      });
    });

    it('should map to action of type LoadFilterForCategoriesSuccess', () => {
      const action = new fromActions.LoadFilterForCategory({ name: 'c' } as Category);
      const completion = new fromActions.LoadFilterForCategorySuccess(filterNav);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadAvailableFilterForCategories$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadFilterForCategoriesFail', () => {
      const action = new fromActions.LoadFilterForCategory({ name: 'invalid' } as Category);
      const completion = new fromActions.LoadFilterForCategoryFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadAvailableFilterForCategories$).toBeObservable(expected$);
    });
  });

  describe('loadFilterIfCategoryWasSelected$', () => {
    it('should trigger LoadFilterForCategory for SelectCategory action', () => {
      const action = new LoadCategorySuccess(
        categoryTree([
          {
            uniqueId: 'Cameras.Camcorder',
            categoryPath: ['Cameras', 'Cameras.Camcorder'],
          } as Category,
          {
            uniqueId: 'Cameras',
            categoryPath: ['Cameras'],
          } as Category,
        ])
      );
      store$.dispatch(new SelectCategory('Cameras.Camcorder'));
      store$.dispatch(action);

      const completion = new fromActions.LoadFilterForCategory({
        categoryPath: ['Cameras', 'Cameras.Camcorder'],
        uniqueId: 'Cameras.Camcorder',
        children: undefined,
        hasChildren: undefined,
        pathCategories: undefined,
      } as CategoryView);
      const expected$ = cold('c', { c: completion });
      expect(effects.loadFilterIfCategoryWasSelected$).toBeObservable(expected$);
    });
  });

  describe('applyFilter$', () => {
    it('should call the filterService for ApplyFilter action', () => {
      const action = new fromActions.ApplyFilter({ filterId: 'a', searchParameter: 'b' });
      actions$ = hot('-a', { a: action });

      effects.applyFilter$.subscribe(() => {
        verify(filterServiceMock.applyFilter('a', 'b')).once();
      });
    });

    it('should map to action of type ApplyFilterSuccess', () => {
      const action = new fromActions.ApplyFilter({ filterId: 'a', searchParameter: 'b' });
      const completion = new fromActions.ApplyFilterSuccess(filterNav, 'a', 'b');
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.applyFilter$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type ApplyFilterFail', () => {
      const action = new fromActions.ApplyFilter({ filterId: 'invalid', searchParameter: 'b' });
      const completion = new fromActions.ApplyFilterFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.applyFilter$).toBeObservable(expected$);
    });
  });

  describe('loadFilteredProducts$', () => {
    it('should trigger SetFilteredProducts and LoadProduct for ApplyFilterSuccess action', () => {
      const action = new fromActions.ApplyFilterSuccess(filterNav, 'a', 'b');
      store$.dispatch(action);
      const completion = new fromActions.SetFilteredProducts(['123', '234']);
      const loadProducts1 = new SelectProduct('123');
      const loadProducts2 = new SelectProduct('234');
      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(bcd)', { b: loadProducts1, c: loadProducts2, d: completion });
      expect(effects.loadFilteredProducts$).toBeObservable(expected$);
    });
  });

  describe('loadFilterForSearch$', () => {
    it('should call the filterService for LoadFilterForSearch action', () => {
      const action = new fromActions.LoadFilterForSearch('search');
      actions$ = hot('-a', { a: action });

      effects.loadFilterForSearch$.subscribe(() => {
        verify(filterServiceMock.getFilterForSearch(anything())).once();
      });
    });

    it('should map to action of type LoadFilterForSearchSuccess', () => {
      const action = new fromActions.LoadFilterForSearch('search');
      const completion = new fromActions.LoadFilterForSearchSuccess(filterNav);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadFilterForSearch$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadFilterForSearchFail', () => {
      const action = new fromActions.LoadFilterForSearch('invalid');
      const completion = new fromActions.LoadFilterForSearchFail({ message: 'invalid' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadFilterForSearch$).toBeObservable(expected$);
    });
  });

  describe('loadFilterForSearchIfSearchSuccess$', () => {
    it('should trigger LoadFilterForSearch for SearchProductsSuccess action', () => {
      const action = new SearchProductsSuccess({ searchTerm: 'a', products: null });

      const completion = new fromActions.LoadFilterForSearch('a');
      actions$ = hot('a', { a: action });
      const expected$ = cold('c', { c: completion });
      expect(effects.loadFilterForSearchIfSearchSuccess$).toBeObservable(expected$);
    });
  });
});
