
import { Router } from 'express'
import newClient from '@/api/v1/routes/client';

const clientRoutes: Router = Router();

clientRoutes.use(newClient);

export default clientRoutes;

