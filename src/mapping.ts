interface IMappingkItem {
    cn: string,
    en: string[],
    synonyms?: string[],
}
interface IMappingData {
    [key: string]: IMappingkItem
}

const mappingData: IMappingData = {
    '创建': {
        cn: '创建',
        en: [ 'create', 'creation' ],
        synonyms: [ '新建' ],
    },
    '删除': {
        cn: '删除',
        en: [ 'detele', 'drop', 'remove' ],
    },
    '新建': {
        cn: '新建',
        en: [ 'new' ],
        synonyms: [ '创建' ],
    },
}

export default mappingData
