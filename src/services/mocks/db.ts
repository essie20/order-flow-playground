const DB_NAME = 'order-flow-playground-db';
const ORDERS_STORE = 'orders';
const SETTINGS_STORE = 'settings';

export interface SimulationSettings {
    delayMs: number;
    failureRate: number; // 0 to 1
}

export const DEFAULT_SETTINGS: SimulationSettings = {
    delayMs: 800,
    failureRate: 0,
};

export const db = {
    async init() {
        return new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 2); // Bump version for new store

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(ORDERS_STORE)) {
                    db.createObjectStore(ORDERS_STORE, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
                    db.createObjectStore(SETTINGS_STORE); // key-value store
                }
            };
        });
    },

    async getOrder(id: string): Promise<any> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(ORDERS_STORE, 'readonly');
            const store = transaction.objectStore(ORDERS_STORE);
            const request = store.get(id);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    },

    async saveOrder(order: any): Promise<void> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(ORDERS_STORE, 'readwrite');
            const store = transaction.objectStore(ORDERS_STORE);
            const request = store.put(order);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    },

    async getSettings(): Promise<SimulationSettings> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(SETTINGS_STORE, 'readonly');
            const store = transaction.objectStore(SETTINGS_STORE);
            const request = store.get('config');

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || DEFAULT_SETTINGS);
        });
    },

    async updateSettings(settings: SimulationSettings): Promise<void> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(SETTINGS_STORE, 'readwrite');
            const store = transaction.objectStore(SETTINGS_STORE);
            const request = store.put(settings, 'config'); // Singleton key 'config'

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }
};
