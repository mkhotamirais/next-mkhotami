const baseUrlDev = process.env.NEXT_PUBLIC_BASE_URL_DEV!;
const baseUrlProd = process.env.NEXT_PUBLIC_BASE_URL_PROD!;

const isProd = process.env.NODE_ENV === "production";

export const baseUrl = isProd ? baseUrlProd : baseUrlDev;
