// TODO: use indexedBD mock APIs
export const onFetchGroup = () => {
    return Promise.
        resolve([{
            id: Date.now(),
            text: Date.now().toString(), 
        }]);
};

export const onCreateGroup = (groupName: string) => {
    return Promise.
        resolve({
            id: Date.now(),
            text: Date.now().toString(), 
        });
};

export const onCreateSKU = (SKUName: string) => {
    return Promise.
        resolve({
            id: Date.now(),
            text: Date.now().toString(), 
        });
};

export const onFetchSKU = () => {
    return Promise.resolve([{
            id: '1',
            text: '1'
        }, {
            id: '2',
            text: '2'
        }, {
            id: '3',
            text: '3'
        }, {
            id: '4',
            text: '4'
        }, {
            id: '5',
            text: '5'
        }, {
            id: '6',
            text: '6'
        }, ]);
};