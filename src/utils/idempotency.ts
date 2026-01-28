export const generateIdempotencyKey = (): string => {
    return `${Date.now()}-${globalThis.crypto.randomUUID()}`;
};
