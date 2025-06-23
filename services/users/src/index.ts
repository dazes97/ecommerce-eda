import express from 'express';
import bodyParser from 'body-parser';
import usersRouter from './adapters/http/UsersController';
import { subscribe } from '../../events';

const app = express();
app.use(bodyParser.json());
app.use(usersRouter);

subscribe('user.registered', async (payload) => {
  console.log('Evento user.registered recibido:', payload);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Users service listening on port ${port}`));
