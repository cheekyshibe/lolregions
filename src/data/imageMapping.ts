// 说明：英雄图片URL的corner case映射
// 当标准拼接规则无法获取正确图片时使用

export interface ImageMapping {
    [key: string]: string; // 原始ID -> 实际用于拼接的ID
}

// 标准规则：首字母大写 + 其余小写
// 备用规则：全部小写
// 当以上规则都无法获取正确图片时，在此映射中指定实际ID
export const imageMapping: ImageMapping = {
    'drmundo': 'DrMundo',
    'jarvaniv': 'JarvanIV',
    'wukong': 'MonkeyKing',
    'kogmaw': 'KogMaw',
    'reksai': 'RekSai',
    'ksante': 'KSante',
    'masteryi': 'MasterYi',
    'xinzhao': 'XinZhao',
    'aurelionsol': 'AurelionSol',
    'kindred': 'Kindred',
    'tahmkench': 'TahmKench',
    'ekko': 'Ekko',
    'kalista': 'Kalista',
    'leesin': 'LeeSin',
    'missfortune': 'MissFortune',
    'twistedfate': 'TwistedFate'
};

// 获取正确的图片ID
export function getCorrectImageId(originalId: string): string {
    if (imageMapping[originalId]) {
        return imageMapping[originalId];
    }

    return originalId.charAt(0).toUpperCase() + originalId.slice(1).toLowerCase();
}

export function getChampionImageUrl(originalId: string): string {
    const correctId = getCorrectImageId(originalId);
    return `https://game.gtimg.cn/images/lol/act/img/champion/${correctId}.png`;
}
