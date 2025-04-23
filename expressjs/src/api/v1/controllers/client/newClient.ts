import express, { type Request, type Response } from 'express';
import { createClient } from '@/utils/clientSetup';


const newClient = async (req: Request, res: Response) => {
    const { clientId, domain } = req.body;

    if (!clientId || !domain) {
        return res.status(400).json({ error: 'clientId and domain are required' });
    }

    try {
        await createClient(clientId, domain);
        res.status(201).json({ message: 'Client created successfully!' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export default newClient;
