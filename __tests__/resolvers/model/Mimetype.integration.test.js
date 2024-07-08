import { setupDatabase, cleanupDatabase, db } from '../../../setupTestDatabase';
import { getMimetypeIdByType } from '../../../src/resolvers/model/Mimetype';
import { describe, expect, it, beforeAll, afterAll, beforeEach } from '@jest/globals';

let container;

beforeAll(async () => {
    const setup = await setupDatabase();
    container = setup.container;
});

afterAll(async () => {
    await cleanupDatabase();
    await container.stop();
});

describe('Mimetype.js integration tests', () => {
    beforeEach(async () => {
        await db('mimetype').del();

        await db('mimetype').insert([
            { id: 1, type: 'image/png', category: 'IMAGE' },
            { id: 2, type: 'video/mp4', category: 'VIDEO' },
        ]);
    });

    it('should return the correct id for a given mimetype', async () => {
        const mimetype = 'image/png';
        const result = await getMimetypeIdByType(db, mimetype);
        expect(result.id).toBe(1);
    });

    it('should return undefined if the mimetype does not exist', async () => {
        const mimetype = 'application/pdf';
        const result = await getMimetypeIdByType(db, mimetype);
        expect(result).toBeUndefined();
    });

    it('should return the correct id for another mimetype', async () => {
        const mimetype = 'video/mp4';
        const result = await getMimetypeIdByType(db, mimetype);
        expect(result.id).toBe(2);
    });
});
