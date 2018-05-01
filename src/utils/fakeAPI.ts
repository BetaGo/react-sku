import Dexie from 'dexie';

interface SKUValue {
    id?: number;
    text?: string;
    pid?: number;
}
interface SKUName {
    id?: number;
    text?: string;
}

class SKUDatabase extends Dexie {
    skuValue: Dexie.Table<SKUValue, number>;
    skuName: Dexie.Table<SKUName, number>;

    constructor() {
        super('SKUDatabase');
        this.version(1).stores({
            skuValue: '++id,text,pid',
            skuName: '++id,text',
        });
    }
}

const db = new SKUDatabase();

export const onFetchGroup = async () => {
    let result = await db.transaction('rw', db.skuName, async () => {
        if ((await db.skuName.where('text').equals('颜色').count()) === 0) {
            await db.skuName.add({text: '颜色'});
        }

        let group = await db.skuName.toArray();
        return group;
    });

    return result;
};

export const onCreateGroup = async (groupName: string) => {
    let result = await db.transaction('rw', db.skuName, async () => {
        let id = await db.skuName.add({text: groupName});
        return {id, text: groupName};
    });
    return result;
};

export const onCreateSKU = async (skuName: string, groupId: number) => {
    let result = await db.transaction('rw', db.skuValue, async () => {
        let id = await db.skuValue.add({text: skuName, pid: groupId});
        return {id, text: skuName};
    });
    return result;
};

export const onFetchSKU = async (groupId: number) => {
    let result = await db.transaction('r', db.skuValue, async () => {
        let skuArr = await db.skuValue.where('pid').equals(groupId).toArray();
        return skuArr;
    });
    return result;
};