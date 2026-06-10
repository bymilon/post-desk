import { Hono } from 'hono';
import { createPostHandler, updatePostHandler, searchPostsHandler } from './handler';

const postsRouter = new Hono();

postsRouter.get('/', searchPostsHandler);
postsRouter.post('/', createPostHandler);
postsRouter.patch('/:key', updatePostHandler);

export default postsRouter;
