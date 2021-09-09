import { Model } from '../Model/Model';
import IDatabaseContexts from './contexts'
export default class DBContext {
    /**
     * Creates / Opens a Database
     * @param {string} dbName 
     * @param {string} schema 
     */
    constructor(dbName, schema = null) {
        if (!dbName) throw new Error("Database Name is Required.");
        /**
         * Database Path & Name
         */
        this.__path = { dbName, schema, fullPath: (schema && `${schema}.${dbName}`) || dbName };
        /**
         * Database Open Request
         * @type {IDBOpenDBRequest}
         */
        this.__connection = null;
        /**
         * IndexedDB Database
         * @type {IDBDatabase}
         */
        this.database = null;
        /**
         * Keeps Database in Mind :)
         */
        IDatabaseContexts.addContext(this);
        /**
         * Tables in current database
         * @type {Array<Model>}
         */
        this.__models = [];
    }
    run() {
        this.__connection = this.DBFactory.open(this.__path.fullPath);
        return new Promise((resolve, reject) => {
            if (this.__connection === null) {
                IDatabaseContexts.destroyContext(this);
                throw new Error('Could not Establish Database Connection.');
            }
            this.__connection.addEventListener('success', async (event) => {
                IDatabaseContexts.setConnectionState(this, true);
                this.database = event.target.result;
                resolve(await this.onConfiguration(event));
            });
            this.__connection.addEventListener('error', (event) => {
                reject(event);
            });
            this.__connection.addEventListener('upgradeneeded', async (event) => {
                IDatabaseContexts.setConnectionState(this, true);
                await this.onReconfiguration(event);
            });
        });
    }
    bindModel(model) {
        if (!(model instanceof Model)) throw new Error('model must be instance of Model class.');
        if (this.__models.some(x => Model.__equals(x, model))) throw new Error('There is already exists a model with same conditions in current database.');
    }
    async onConfiguration(event) {
        const transaction = event.target.transaction || event.target.result.transaction(storeNames);

        return true;
    }
    async onReconfiguration(event) {
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