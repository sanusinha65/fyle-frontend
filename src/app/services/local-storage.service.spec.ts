// src/app/services/local-storage.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);

    // Clear localStorage before each test to ensure a clean state
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set an item in localStorage', () => {
    const key = 'testKey';
    const value = 'testValue';

    service.setItem(key, value);

    expect(localStorage.getItem(key)).toBe(value);
  });

  it('should get an item from localStorage', () => {
    const key = 'testKey';
    const value = 'testValue';

    localStorage.setItem(key, value);

    expect(service.getItem(key)).toBe(value);
  });

  it('should return null when getting a non-existent item', () => {
    const key = 'nonExistentKey';

    expect(service.getItem(key)).toBeNull();
  });

  it('should remove an item from localStorage', () => {
    const key = 'testKey';
    const value = 'testValue';

    localStorage.setItem(key, value);
    service.removeItem(key);

    expect(localStorage.getItem(key)).toBeNull();
  });

  it('should clear all items from localStorage', () => {
    const key1 = 'testKey1';
    const value1 = 'testValue1';
    const key2 = 'testKey2';
    const value2 = 'testValue2';

    localStorage.setItem(key1, value1);
    localStorage.setItem(key2, value2);
    service.clear();

    expect(localStorage.getItem(key1)).toBeNull();
    expect(localStorage.getItem(key2)).toBeNull();
  });
});
