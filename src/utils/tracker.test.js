import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getDayString, calculateMeals } from './tracker';

describe('tracker', () => {
  describe('getDayString', () => {
    it('should format date as YYYY-MM-DD', () => {
      const date = new Date(2026, 4, 5); // May 5
      expect(getDayString(date)).toBe('2026-05-05');
    });
  });

  describe('calculateMeals', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return zeros if no startDate', () => {
      expect(calculateMeals(null, 56, [])).toEqual({
        remainingMeals: 0,
        consumedMeals: 0,
        projectedEndDate: null
      });
    });

    it('should calculate meals before 12 PM', () => {
      const today = new Date(2026, 4, 11, 10, 0, 0);
      vi.setSystemTime(today);

      const startDate = '2026-05-11';
      const totalMeals = 56;
      const skippedMeals = [];

      const result = calculateMeals(startDate, totalMeals, skippedMeals);
      
      expect(result.consumedMeals).toBe(0);
      expect(result.remainingMeals).toBe(56);
    });

    it('should calculate meals between 12 PM and 8 PM', () => {
      const today = new Date(2026, 4, 11, 14, 0, 0);
      vi.setSystemTime(today);

      const startDate = '2026-05-11';
      const totalMeals = 56;
      const skippedMeals = [];

      const result = calculateMeals(startDate, totalMeals, skippedMeals);
      
      expect(result.consumedMeals).toBe(1);
      expect(result.remainingMeals).toBe(55);
    });

    it('should calculate meals at exactly 12 PM', () => {
      const today = new Date(2026, 4, 11, 12, 0, 0);
      vi.setSystemTime(today);

      const startDate = '2026-05-11';
      const totalMeals = 56;
      const skippedMeals = [];

      const result = calculateMeals(startDate, totalMeals, skippedMeals);
      
      expect(result.consumedMeals).toBe(1);
      expect(result.remainingMeals).toBe(55);
    });

    it('should calculate meals after 8 PM', () => {
      const today = new Date(2026, 4, 11, 21, 0, 0);
      vi.setSystemTime(today);

      const startDate = '2026-05-11';
      const totalMeals = 56;
      const skippedMeals = [];

      const result = calculateMeals(startDate, totalMeals, skippedMeals);
      
      expect(result.consumedMeals).toBe(2);
      expect(result.remainingMeals).toBe(54);
    });

    it('should calculate meals at exactly 8 PM', () => {
      const today = new Date(2026, 4, 11, 20, 0, 0);
      vi.setSystemTime(today);

      const startDate = '2026-05-11';
      const totalMeals = 56;
      const skippedMeals = [];

      const result = calculateMeals(startDate, totalMeals, skippedMeals);
      
      expect(result.consumedMeals).toBe(2);
      expect(result.remainingMeals).toBe(54);
    });

    it('should handle Sunday correctly (only 1 meal)', () => {
      const today = new Date(2026, 4, 10, 21, 0, 0); // May 10 2026 is Sunday
      vi.setSystemTime(today);

      const startDate = '2026-05-10';
      const totalMeals = 56;
      const skippedMeals = [];

      const result = calculateMeals(startDate, totalMeals, skippedMeals);
      
      expect(result.consumedMeals).toBe(1);
      expect(result.remainingMeals).toBe(55);
    });

    it('should account for skipped meals', () => {
      const today = new Date(2026, 4, 12, 10, 0, 0); // Tue 10 AM
      vi.setSystemTime(today);

      const startDate = '2026-05-11'; // Mon
      const totalMeals = 56;
      const skippedMeals = ['2026-05-11-lunch'];

      const result = calculateMeals(startDate, totalMeals, skippedMeals);
      
      // Mon (2) + Tue (0, before 12) = 2 meals generated.
      // 1 skipped.
      // Consumed = 2 - 1 = 1.
      expect(result.consumedMeals).toBe(1);
      expect(result.remainingMeals).toBe(55);
    });

    it('should project end date correctly', () => {
      const today = new Date(2026, 4, 11, 21, 0, 0);
      vi.setSystemTime(today);

      const startDate = '2026-05-11';
      const totalMeals = 4;

      const result = calculateMeals(startDate, totalMeals, []);
      
      expect(result.projectedEndDate.getDate()).toBe(12);
      expect(result.projectedEndDate.getMonth()).toBe(4); // May
    });

    it('should project end date correctly across Sunday', () => {
      const today = new Date(2026, 4, 15, 21, 0, 0); // Friday May 15
      vi.setSystemTime(today);

      const startDate = '2026-05-15';
      const totalMeals = 5; // Fri(2), Sat(2), Sun(1)

      const result = calculateMeals(startDate, totalMeals, []);
      
      expect(result.projectedEndDate.getDate()).toBe(17); // Sunday
      expect(result.projectedEndDate.getMonth()).toBe(4); // May
    });

    it('should project end date correctly when reaching Sunday with 2 meals remaining', () => {
      const today = new Date(2026, 4, 15, 21, 0, 0); // Friday May 15
      vi.setSystemTime(today);

      const startDate = '2026-05-15';
      const totalMeals = 6; // Fri(2), Sat(2), Sun(1), Mon(1)

      const result = calculateMeals(startDate, totalMeals, []);
      
      expect(result.projectedEndDate.getDate()).toBe(18); // Mon
      expect(result.projectedEndDate.getMonth()).toBe(4); // May
    });

    it('should project end date correctly for a long plan', () => {
      const today = new Date(2026, 4, 11, 21, 0, 0); // Mon
      vi.setSystemTime(today);

      const startDate = '2026-05-11';
      const totalMeals = 15;

      const result = calculateMeals(startDate, totalMeals, []);
      
      expect(result.projectedEndDate.getDate()).toBe(18); // Mon
      expect(result.projectedEndDate.getMonth()).toBe(4); // May
    });

    it('should return today as projectedEndDate if no meals remaining', () => {
      const today = new Date(2026, 4, 11, 21, 0, 0); // Mon
      vi.setSystemTime(today);

      const startDate = '2026-05-11';
      const totalMeals = 2; // All consumed today

      const result = calculateMeals(startDate, totalMeals, []);
      
      expect(result.consumedMeals).toBe(2);
      expect(result.remainingMeals).toBe(0);
      expect(result.projectedEndDate.getDate()).toBe(11);
      expect(result.projectedEndDate.getMonth()).toBe(4); // May
    });

    it('should calculate meals for past Sunday correctly', () => {
      const today = new Date(2026, 4, 12, 21, 0, 0); // Tue May 12
      vi.setSystemTime(today);

      const startDate = '2026-05-09'; // Sat May 9
      const totalMeals = 56;
      const skippedMeals = [];

      const result = calculateMeals(startDate, totalMeals, skippedMeals);
      
      // Sat (2) + Sun (1) + Mon (2) + Tue (2) = 7 meals.
      expect(result.consumedMeals).toBe(7);
    });
  });
});
