import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { createDNSRecord } from '@/libs/cloudflare';

/**
 * Creates and deploys a client website from a selected template.
 *
 * @param merchantId The ID of the client (merchant)
 * @param websiteId  The unique ID of the website (uuid)
 * @param templateId The template folder name to use (e.g. 'portfolio')
 * @param domains    List of domains to point to this website (e.g. ['client1.domain.com', 'client1-alt.com'])
 */
export const createClientWebsite = async (
    merchantId: string,
    websiteId: string,
    templateId: string,
    domains: string[]
) => {
    const projectRoot = path.resolve(__dirname, '../../../');

    // Paths
    const templatePath = path.join(projectRoot, 'expo-templates', templateId);
    const websitePath = path.join(projectRoot, 'nginx', 'clients', merchantId, websiteId);
    const buildImageName = `client-${websiteId}-build`;
    const tempContainerName = `client-${websiteId}-temp`;

    // Prevent duplicate creation
    if (fs.existsSync(websitePath)) {
        throw new Error(`Website already exists: ${websitePath}`);
    }

    // Step 1: Copy template to new client website folder
    await fs.copy(templatePath, websitePath);

    // Step 2: Docker build static site
    execSync(`docker build -t ${buildImageName} .`, {
        cwd: websitePath,
        stdio: 'inherit',
    });

    // Step 3: Export dist from container
    execSync(`docker create --name ${tempContainerName} ${buildImageName}`);
    execSync(`docker cp ${tempContainerName}:/app/dist ${websitePath}/dist`);
    execSync(`docker rm ${tempContainerName}`);

    // Step 4: Handle each domain
    for (const domain of domains) {
        // Create DNS record
        await createDNSRecord(domain);

        // Generate NGINX config
        const nginxConf = `
server {
    listen 80;
    server_name ${domain};

    root /usr/share/nginx/html/clients/${merchantId}/${websiteId}/dist;
    index index.html;

    location /api/ {
        proxy_pass http://server:3000/;
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
        const confPath = path.join(projectRoot, 'nginx', 'conf.d', `${websiteId}__${domain}.conf`);
        await fs.writeFile(confPath, nginxConf);
    }

    // Step 5: Reload NGINX to apply all new domains
    execSync('docker exec tenant-nginx nginx -s reload');
};
