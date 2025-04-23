
import { Router } from 'express'
import newClient from '@/api/v1/controllers/client/newClient';

const addClientRoutes: Router = Router();

addClientRoutes.post('/addClient', newClient);

export default addClientRoutes;

