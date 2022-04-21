import { Request } from "express";

export default function getCookie(req: Request) {
    const cookies = req.headers.cookie;
    const splitCookies = cookies.split(';');
    return splitCookies.reduce<(string)[][]>((prev: [(string)[]],cookie: string) => [cookie.split('='), ...prev], [])
}