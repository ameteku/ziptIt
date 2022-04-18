export default function checkKeys(neededKeys: string[], keys: string[]): boolean {
    for( const e  of neededKeys) {
       if(!keys.includes(e)) {
           return false;
       }
    }
    return true;
}