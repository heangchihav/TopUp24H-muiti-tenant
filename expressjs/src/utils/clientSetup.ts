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
 * @param domains    List of domains to point to this website (e.g. ['client1.domain.com'])
 */
export const createClientWebsite = async (
    merchantId: string,
    websiteId: string,
    templateId: string,
    domains: string[]
) => {
    const projectRoot = path.resolve(__dirname, '../../../');

    // Define folders
    const templatePath = path.join(projectRoot, 'ui', 'themes', templateId);
    const websiteSourcePath = path.join(projectRoot, 'ui', 'frontend', merchantId, websiteId);
    const websiteDistPath = path.join(projectRoot, 'nginx', 'clients', merchantId, websiteId, 'dist');

    const buildImageName = `client-${websiteId}-build`;
    const tempContainerName = `client-${websiteId}-temp`;

    if (fs.existsSync(websiteSourcePath)) {
        throw new Error(`Client website already exists: ${websiteSourcePath}`);
    }

    // 1. Copy selected template to frontend folder for editing
    await fs.copy(templatePath, websiteSourcePath);

    // 2. Build Docker image from the client's editable code
    execSync(`docker build -t ${buildImageName} .`, {
        cwd: websiteSourcePath,
        stdio: 'inherit',
    });

    // 3. Export dist files from container
    execSync(`docker create --name ${tempContainerName} ${buildImageName}`);
    await fs.ensureDir(websiteDistPath);
    execSync(`docker cp ${tempContainerName}:/app/dist ${websiteDistPath}`);
    execSync(`docker rm ${tempContainerName}`);

    // 4. Create domain NGINX configs
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
        const confFilePath = path.join(projectRoot, 'nginx', 'conf.d', `${websiteId}__${domain}.conf`);
        await fs.outputFile(confFilePath, nginxConf);
    }

    // 5. Reload NGINX
    execSync('docker exec nginx nginx -s reload');
};
