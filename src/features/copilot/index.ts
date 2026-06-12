import { Hono } from 'hono';
import { generateDraftsHandler } from './handler';

const copilotRouter = new Hono();

copilotRouter.post('/generate-drafts', generateDraftsHandler);

export default copilotRouter;
