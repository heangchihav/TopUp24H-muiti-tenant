// lib/cloudflare.ts
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const CF_API = 'https://api.cloudflare.com/client/v4';

export const createDNSRecord = async (name: string, type: 'A' | 'CNAME' = 'A') => {
    const zoneId = process.env.CLOUDFLARE_ZONE_ID;
    const token = process.env.CLOUDFLARE_API_TOKEN;
    const ip = process.env.SERVER_IP;

    if (!zoneId || !token || !ip) {
        throw new Error('Missing Cloudflare API credentials or server IP');
    }

    try {
        const res = await axios.post(
            `${CF_API}/zones/${zoneId}/dns_records`,
            {
                type,
                name, // full domain like client1.yourdomain.com
                content: ip,
                ttl: 3600, // Time-to-live (1 hour)
                proxied: true, // Set to true to enable Cloudflare proxy
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!res.data.success) {
            console.error('Cloudflare Error:', res.data.errors);
            throw new Error('Failed to create DNS record');
        }

        // Returning the full DNS record data for better context
        return res.data.result;
    } catch (error) {
        console.error('Error creating DNS record:', error);
        throw new Error('Failed to create DNS record');
    }
};
