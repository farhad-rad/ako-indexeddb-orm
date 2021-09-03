import IDatabaseContexts from './contexts'
export default class DBContext {
    /**
     * Creates / Opens a Database
     * @param {string} dbName 
     * @param {string} schema 
     */
    constructor(dbName, schema = null) {
        if (!dbName) throw new Error("Database Name is Required.");
        this.dbPath = { dbName, schema, fullPath: (schema && `${schema}.${dbName}`) || dbName };
        /**
         * Database Open Request
         * @type {IDBOpenDBRequest}
         */
        this.dbConnection = null;
        /**
         * Migration Model Builder
         */
        this.modelBuilder = null;
        /**
         * IndexedDB Database
         * @type {IDBDatabase}
         */
        this.database = null;
        /**
         * Keeps Database in Mind :)
         */
        IDatabaseContexts.addContext(this);
    }
    connect() {
        this.dbConnection = this.DBFactory.open(this.dbPath.fullPath);
        return new Promise((resolve, reject) => {
            if (this.dbConnection === null) {
                IDatabaseContexts.destroyContext(this);
                throw new Error('Could not Establish Database Connection.');
            }
            this.dbConnection.addEventListener('success', async (event) => {
                IDatabaseContexts.setConnectionState(this, true);
                resolve(await this.onConfiguration(event));
            });
            this.dbConnection.addEventListener('error', (event) => {
                reject(event);
            });
            this.dbConnection.addEventListener('upgradeneeded', async (event) => {
                IDatabaseContexts.setConnectionState(this, true);
                await this.onReconfiguration(event);
            });
        });
    }
    async onConfiguration(event){
        return true;
    }
    async onReconfiguration(event){
        return true;
    }
    /**
     * @returns {IDBFactory}
     */
    get DBFactory() {
        const idb = indexedDB || window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        if (!idb) {
            throw new Error("IndexedDB Constructor not Found in Current Environment");
        }
        return idb;
    }
}
export { DBContext, IDatabaseContexts };