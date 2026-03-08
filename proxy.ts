import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimit = new Map<string, { count: number; time: number }>();

const blockedAgents = [
    "curl",
    "python",
    "scrapy",
    "wget",
    "httpclient",
    "postman",
    "insomnia",
    "headless",
    "puppeteer",
    "playwright",
];

function getIP(request: NextRequest): string {
    const xff = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const cfIp = request.headers.get("cf-connecting-ip");

    if (cfIp) return cfIp;
    if (realIp) return realIp;
    if (xff) return xff.split(",")[0].trim();

    return "unknown";
}

export function proxy(request: NextRequest) {
    // Bloquear métodos suspeitos
    if (!["GET", "POST"].includes(request.method)) {
        return new NextResponse("Method Not Allowed", { status: 405 });
    }

    // Honeypot route (anti scraper)
    if (request.nextUrl.pathname.includes("internal")) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const ua = request.headers.get("user-agent")?.toLowerCase() || "";

    // Bloquear user-agent vazio
    if (!ua) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    // Bloquear bots conhecidos
    if (blockedAgents.some((bot) => ua.includes(bot))) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const ip = getIP(request);

    // Bloquear IP não identificado
    if (ip === "unknown") {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const now = Date.now();
    const window = 10000; // 10 segundos
    const limit = 50;

    const record = rateLimit.get(ip) || { count: 0, time: now };

    if (now - record.time < window) {
        record.count += 1;
    } else {
        record.count = 1;
        record.time = now;
    }

    rateLimit.set(ip, record);

    // Limpeza automática (evita memory leak)
    if (now - record.time > window * 2) {
        rateLimit.delete(ip);
    }

    // Rate limit
    if (record.count > limit) {
        return new NextResponse("Too many requests", { status: 429 });
    }

    const response = NextResponse.next();

    // Headers extras de proteção
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("X-RateLimit-Limit", limit.toString());

    return response;
}

export const config = {
    matcher: ["/api/:path*"],
};
