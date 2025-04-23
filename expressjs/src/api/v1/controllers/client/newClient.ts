import express, { type Request, type Response } from 'express';
import { createClientWebsite } from '@/utils/clientSetup';


const newClient = async (req: Request, res: Response) => {
    const { merchantId, websiteId, templateId, domains } = req.body;

    if (!merchantId || !websiteId || !templateId || !domains || !Array.isArray(domains)) {
        return res.status(400).json({ error: 'Missing required fields: merchantId, websiteId, templateId, domains[]' });
    }

    try {
        await createClientWebsite(merchantId, websiteId, templateId, domains);
        res.status(201).json({ message: 'Client website created and deployed successfully!' });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
    return; // Ensure all code paths return a value
};

export default newClient;
