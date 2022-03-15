export default function checkKeys(neededKeys: string[], keys: string[]): boolean {
    for( const e  of neededKeys) {
       if(keys.includes(e) === undefined) {
           return false;
       }
    }
    return true;
}