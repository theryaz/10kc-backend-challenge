import 'reflect-metadata';
import * as express from 'express';
import { BACKEND_CONFIG } from './config';
import { mongoMakeConnection } from './app/common/mongo';

import { Container } from 'typedi';
import { UserController } from './app/user/userController';
import { PhotoController } from './app/photo/photoController';
import { errorHandler } from './app/common/errors/errorHandler';
import { logRequest } from './app/common/middleware/logRequest';
async function main(){
  await mongoMakeConnection({
    MONGO_URL: BACKEND_CONFIG.MONGO_URL,
    MONGO_DB_NAME: BACKEND_CONFIG.MONGO_DB_NAME,
  });
  const app = express();
  app.use(express.json());
  app.use(logRequest);
  const userController = Container.get(UserController);
  const photoController = Container.get(PhotoController);
  app.use('/user', userController.createRouter());
  app.use('/photo', photoController.createRouter());

  app.use(errorHandler);

  const port = process.env.port || 3333;
  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
  });
  server.on('error', console.error);
}
main();