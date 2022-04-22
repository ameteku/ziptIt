import { Request } from "express";

export default function getCookie(req: Request) {
    const cookies = req.headers.cookie ?? '';
    const splitCookies = cookies?.split(';');

    if(!splitCookies || splitCookies.length == 0) {
        return [[]];
    }
    return splitCookies.reduce<(string)[][]>((prev: [(string)[]],cookie: string) => [cookie.split('='), ...prev], [])
}