import { TestBed } from '@angular/core/testing';

import { NetworkServices } from './network.services';

describe('NetworkServices', () => {
  let service: NetworkServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
