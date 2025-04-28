import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const CLOUDFLARE_API = "https://api.cloudflare.com/client/v4";

export async function createDnsRecordAndTunnel(domainName: string) {
    const token = process.env.CLOUDFLARE_API_TOKEN!;
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;

    // 1. Create DNS record (A record to 127.0.0.1 or CNAME to tunnel)
    const dnsRes = await axios.post(`${CLOUDFLARE_API}/zones/${accountId}/dns_records`, {
        type: "CNAME",
        name: domainName,
        content: "your-tunnel-id.cfargotunnel.com",
        ttl: 120,
        proxied: true,
    }, {
        headers: { Authorization: `Bearer ${token}` },
    });

    // You can also manage tunnel API here if needed (future feature)

    return dnsRes.data.result;
}
