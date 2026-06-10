import { Hono } from 'hono';
import { createInspirationHandler, getInspirationsHandler } from './handler';

const inspirationRouter = new Hono();

inspirationRouter.post('/', createInspirationHandler);
inspirationRouter.get('/', getInspirationsHandler);

export default inspirationRouter;
