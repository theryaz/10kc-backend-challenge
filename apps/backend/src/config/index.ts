import { config } from 'dotenv';
import { BackendConfiguration } from './BackendConfiguration';
// Must create  .env file at root of project to load configurations from environment
config();

export const BACKEND_CONFIG: BackendConfiguration = {
	BASE_URL: process.env['BASE_URL'],
	MONGO_URL: process.env['MONGO_URL'],
	MONGO_DB_NAME: process.env['MONGO_DB_NAME'],
};