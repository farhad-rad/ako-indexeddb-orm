import { DBContext, IDatabaseContexts } from './DBContext/DBContext';
((self) => {
    self.IDatabaseContexts = IDatabaseContexts;
    self.DBContext = DBContext;
    /*self.idbTypes = {
        CursorTypes: {
            'AscendingUnique': CursorDirection.AscendingUnique,
            'Ascending': CursorDirection.Ascending,
            'Descending': CursorDirection.Descending,
            'DescendingUnique': CursorDirection.DescendingUnique
        },
        RelationTypes: {
            'HasManyThroughMultiEntry': RelationTypes.HasManyThroughMultiEntry,
            'HasManyMultiEntry': RelationTypes.HasManyMultiEntry,
            'HasMany': RelationTypes.HasMany,
            'HasOne': RelationTypes.HasOne
        },
        TransactionModes: {
            'ReadOnly': TransactionModes.ReadOnly,
            'Write': TransactionModes.Write,
            'VersionChange': TransactionModes.VersionChange,
        }
    };*/
})(window);