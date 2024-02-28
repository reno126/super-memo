import { formatTime } from "../utils/dateTimeUtils";

describe('dateTimeUtils', () => {
    describe('formatTime', () => {
        it('should format seconds less than 60', () => {
            expect(formatTime(0)).toBe('0:00');
            expect(formatTime(5)).toBe('0:05');
            expect(formatTime(59)).toBe('0:59');
        });

        it('should format seconds greater than 60', () => {
            expect(formatTime(60)).toBe('1:00');
            expect(formatTime(65)).toBe('1:05');
            expect(formatTime(119)).toBe('1:59');
        });

        it('should format multiple minutes', () => {
            expect(formatTime(120)).toBe('2:00');
            expect(formatTime(600)).toBe('10:00');
            expect(formatTime(3599)).toBe('59:59');
        });
    });
});