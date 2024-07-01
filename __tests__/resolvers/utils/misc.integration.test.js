import { describe, expect, it } from '@jest/globals';
import { getDates, hashPassword } from '../../../src/resolvers/utils/misc';
import crypto from 'crypto';

describe('misc.js integration tests', () => {
    describe('getDates', () => {
        it('should return the correct date and formatted date', () => {
            const { sessionExpireDateTime, sessionExpireDateTimeFormatted } = getDates();

            const expectedExpireDateTime = new Date(new Date().getTime() + 60 * 60 * 1000).toISOString();
            const expectedFormattedDateTime = new Date(expectedExpireDateTime).toISOString().replace('T', ' ').substring(0, 19);

            // Check that the returned dates are within a reasonable range
            expect(new Date(sessionExpireDateTime).getTime()).toBeCloseTo(new Date(expectedExpireDateTime).getTime(), -2);
            expect(sessionExpireDateTimeFormatted).toBe(expectedFormattedDateTime);
        });
    });

    describe('hashPassword', () => {
        it('should return the correct hash for the password', () => {
            const password = 'password123';
            const expectedHash = crypto.createHash('sha3-512').update(password).digest('hex');

            const hash = hashPassword(password);

            expect(hash).toBe(expectedHash);
        });
    });
});
