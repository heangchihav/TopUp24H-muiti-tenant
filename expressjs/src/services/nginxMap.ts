import fs from "fs";
import dotenv from "dotenv";
import prisma from "@/libs/prisma";


export async function updateNginxDomainMap() {
    const domains = await prisma.websiteDomain.findMany({
        include: { domain: true, website: true },
    });

    let mapContent = "map $host $web_root {\n    default /var/www/default;\n";
    for (const entry of domains) {
        const folder = `/var/www/${entry.website.merchantId}`; // map to merchantId folder
        mapContent += `    ${entry.domain.name} ${folder};\n`;
    }
    mapContent += "}";

    fs.writeFileSync(process.env.NGINX_DOMAIN_MAP_PATH!, mapContent, "utf8");
    console.log("[NGINX] domain_map.conf updated");
}
