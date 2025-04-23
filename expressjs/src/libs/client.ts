// lib/client.ts
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { createDNSRecord } from './cloudflare'; // Cloudflare DNS record creation
import { Domain, Website, WebsiteDomain } from '@prisma/client';
import prisma from './prisma';

export const addDomainToClientWebsite = async (clientId: string, newDomain: string, websiteId: string, isPrimary: boolean = false) => {
    const projectRoot = path.resolve(__dirname, '../../../');
    const nginxConfPath = path.join(projectRoot, 'nginx', 'conf.d', `${clientId}.conf`);

    // Step 1: Check if the domain is already in use
    const existingDomain = await prisma.domain.findUnique({
        where: { name: newDomain }
    });

    if (existingDomain) {
        throw new Error('This domain is already in use');
    }

    // Step 2: Create a new domain record in the database
    const domain = await prisma.domain.create({
        data: {
            name: newDomain,
            cloudflareAccountId: 'your-cloudflare-account-id', // Update with correct account ID
            addedById: clientId,
        },
    });

    // Step 3: Create DNS record in Cloudflare
    await createDNSRecord(newDomain);

    // Step 4: Add the domain to the specific client’s website
    const websiteDomain = await prisma.websiteDomain.create({
        data: {
            websiteId,
            domainId: domain.id,
            subdomain: null, // Optional: You can use subdomains here
            isPrimary, // Indicate if this is the primary domain
        },
    });

    // Step 5: Update NGINX config for the new domain
    const nginxConf = `
server {
    listen 80;
    server_name ${newDomain};

    root /usr/share/nginx/html/clients/${clientId}/dist;
    index index.html;

    location /api/ {
        proxy_pass http://tenant-backend:3000/;
        proxy_set_header Host $host;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
`;

    await fs.appendFile(nginxConfPath, nginxConf); // Append the new domain config

    // Step 6: Reload NGINX to apply the new domain
    execSync('docker exec tenant-nginx nginx -s reload');

    return { domain, websiteDomain };
};
