var existingDbContexts = [];
export default class IDatabaseContexts {
    static getAll() {
        return existingDbContexts;
    }
    static exists(dbName, schema) {
        if (!dbName) {
            throw new Error(`Database Name is Required`);
        }
        let found = existingDbContexts.filter(x => x.dbName == dbName);
        if (schema && schema != null && schema != "") {
            found = found.filter(x => x.schema == schema);
        } else {
            found = found.filter(x => x.schema == null);
        }
        return found.length > 0;
    }
    static addContext(instance) {
        const { schema, dbName } = instance.dbPath;
        if (IDatabaseContexts.exists(dbName, schema)) throw new Error(`There is Already a DBContext Exists Inside Current Enviroment with the Same Name and Schema. You Can Access That by Calling 'IDatabaseContexts.getContext(databaseName, schema)'`);
        existingDbContexts.push({ dbName: dbName, schema: schema, connected: false, instance });
    }
    static getContext(dbName, schema = null) {
        if (!IDatabaseContexts.exists(dbName, schema)) throw new Error(`There is no Database Context Available With Name <${((schema && `${schema}.${dbName}`) || dbName)}>`);
        return existingDbContexts.find(x => x.schema == schema && x.dbName == dbName).instance;
    }
    static destroyContext(instance) {
        const { schema, dbName } = instance.dbPath;
        if (!IDatabaseContexts.exists(dbName, schema)) throw new Error(`There is no Database Context Available With Name <${((schema && `${schema}.${dbName}`) || dbName)}>`);
        existingDbContexts = existingDbContexts.filter(x => x.schema != schema || x.dbName != dbName);
    }
    static setConnectionState(instance, state) {
        const { schema, dbName } = instance.dbPath;
        if (!IDatabaseContexts.exists(dbName, schema)) throw new Error(`There is no Database Context Available With Name <${((schema && `${schema}.${dbName}`) || dbName)}>`);
        const index = existingDbContexts.findIndex(x => x.schema == schema && x.dbName == dbName);
        existingDbContexts[index].connected = state;
    }
    static updateContext(instance) {
        const { schema, dbName } = instance.dbPath;
        if (!IDatabaseContexts.exists(dbName, schema)) throw new Error(`There is no Database Context Available With Name <${((schema && `${schema}.${dbName}`) || dbName)}>`);
        const index = existingDbContexts.findIndex(x => x.schema == schema && x.dbName == dbName);
        existingDbContexts[index].instance = instance;
    }
}