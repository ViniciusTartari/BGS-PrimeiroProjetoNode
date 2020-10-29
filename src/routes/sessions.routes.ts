import { Router } from 'express';

import CreateSessionService from '../services/CreateSessionService';

const sessionsRouter = Router();

// Create
sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const userSession = new CreateSessionService();

  const { user, token } = await userSession.execute({ email, password });

  delete user.password;

  return response.json({ user, token });
});

export default sessionsRouter;
