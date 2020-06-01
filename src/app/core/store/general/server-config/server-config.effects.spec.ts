import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { routerNavigationAction } from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ConfigurationService } from 'ish-core/services/configuration/configuration.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { GeneralStoreModule } from 'ish-core/store/general/general-store.module';

import { LoadServerConfig, LoadServerConfigFail, LoadServerConfigSuccess } from './server-config.actions';
import { ServerConfigEffects } from './server-config.effects';

describe('Server Config Effects', () => {
  let actions$: Observable<Action>;
  let effects: ServerConfigEffects;
  let store$: Store;
  let configurationServiceMock: ConfigurationService;

  beforeEach(() => {
    configurationServiceMock = mock(ConfigurationService);

    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), GeneralStoreModule.forTesting('serverConfig')],
      providers: [
        ServerConfigEffects,
        provideMockActions(() => actions$),
        { provide: ConfigurationService, useFactory: () => instance(configurationServiceMock) },
      ],
    });

    effects = TestBed.inject(ServerConfigEffects);
    store$ = TestBed.inject(Store);
  });

  describe('loadServerConfigOnInit$', () => {
    it('should trigger the loading of config data on the first page', () => {
      // tslint:disable-next-line: no-any
      const action = routerNavigationAction({ payload: {} as any });
      const expected = new LoadServerConfig();

      actions$ = hot('a', { a: action });
      expect(effects.loadServerConfigOnInit$).toBeObservable(cold('a', { a: expected }));
    });

    it('should not trigger the loading of config data on the second page', () => {
      store$.dispatch(
        new LoadServerConfigSuccess({
          config: { application: 'intershop.B2CResponsive' },
        })
      );

      // tslint:disable-next-line: no-any
      const action = routerNavigationAction({ payload: {} as any });
      actions$ = hot('        ----a---a--a', { a: action });
      const expected$ = cold('------------');

      expect(effects.loadServerConfigOnInit$).toBeObservable(expected$);
    });
  });

  describe('loadServerConfig$', () => {
    beforeEach(() => {
      when(configurationServiceMock.getServerConfiguration()).thenReturn(of({}));
    });

    it('should map to action of type ApplyConfiguration', () => {
      const action = new LoadServerConfig();
      const completion = new LoadServerConfigSuccess({ config: {} });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadServerConfig$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadServerConfigFail', () => {
      when(configurationServiceMock.getServerConfiguration()).thenReturn(throwError({ message: 'invalid' }));

      const action = new LoadServerConfig();
      const completion = new LoadServerConfigFail({ error: { message: 'invalid' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadServerConfig$).toBeObservable(expected$);
    });
  });
});
