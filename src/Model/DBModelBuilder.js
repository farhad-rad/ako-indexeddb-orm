import Model from './Model';
export class DBModelBuilder {
    /**
     * Build / Updates Tables in Database
     * @param {Model} model 
     * @param {IDBDatabase} database 
     */
    constructor(model, database) {
        /**
         * @type {Model}
         */
        this.__model = model;
        /**
         * IndexedDB Database
         * @type {IDBDatabase}
         */
        this.__database = database;
        this.__transaction = database.transaction();
    }
    /**
     * Runs the migration action to update the database with new stores or deletes unwanted stored and then creates or
     * drops indexes for the stores.
     */
    async run() {
            if (!this.db.objectStoreNames.contains(table.name)) {
                table.objectStore = this.createObjectStore(table);
            }
            else {
                table.objectStore = this.transaction.objectStore(table.name);
            }
            this.createColumns(table, table.objectStore);
            this.dropOldColumns(table, table.objectStore);
            this.setupSyncColumn(table, table.objectStore);
        for (const tableName of this.allStoreNames()) {
            if (!this.tables.find(table => table.name === tableName)) {
                this.db.deleteObjectStore(tableName);
            }
        }
        return this.tables;
    }
    /**
     * Creates an index in object store
     * @param column
     * @param objectStore
     */
    createIndex(column, objectStore) {
        const attributes = column.attributes || {};
        const index = column.index || column.name;
        return objectStore.createIndex(column.name, index, attributes);
    }
    /**
     * Drops an index in object store
     * @param column
     * @param objectStore
     */
    dropIndex(column, objectStore) {
        objectStore.deleteIndex(column);
        return true;
    }
    /**
     * Creates new object store
     * @param schema
     */
    createObjectStore(schema) {
        let primary = schema.primary || DEFAULT_PRIMARY_ID;
        return this.db.createObjectStore(schema.name, {
            keyPath: primary,
            autoIncrement: true
        });
    }
    /**
     * Drops existing object store
     * @param schema
     */
    dropObjectStore(schema) {
        return true;
    }
    /**
     * Creates various indexes on object store
     * @param table
     * @param objectStore
     */
    createColumns(table, objectStore) {
        for (const column of table.columns) {
            if (!objectStore.indexNames.contains(column.name)) {
                column.dbIndex = this.createIndex(column, objectStore);
            }
        }
    }
    /**
     * Drops indexes in object store
     * @param table
     * @param objectStore
     */
    dropOldColumns(table, objectStore) {
        const indexNames = objectStore.indexNames;
        for (let i = 0; i < indexNames.length; i++) {
            if (!table.columns.find(column => column.name === indexNames[i])) {
                this.dropIndex(indexNames[i], objectStore);
            }
        }
    }
    /**
     * Returns a list of all object store names which are in current database
     */
    allStoreNames() {
        const names = [];
        for (let i = 0; i < this.db.objectStoreNames.length; i++) {
            names.push(this.db.objectStoreNames[i]);
        }
        return names;
    }
    /**
     * Returns all object store instances in database
     */
    listObjectStores() {
        const stores = [];
        for (const tableName of this.allStoreNames()) {
            stores.push(this.transaction.objectStore(tableName));
        }
        return stores;
    }
    /**
     * Returns true if column is to be created
     * @param schema
     * @param objectStore
     */
    setupSyncColumn(schema, objectStore) {
        const columnName = schema.syncColumnName || DEFAULT_SYNC_COLUMN_NAME;
        if (schema.syncColumn) {
            if (!objectStore.indexNames.contains(columnName)) {
                this.createIndex({
                    name: columnName,
                    index: columnName
                }, objectStore);
            }
        }
        else {
            if (objectStore.indexNames.contains(columnName)) {
                this.dropIndex(columnName, objectStore);
            }
        }
    }
}
//# sourceMappingURL=migration.js.map