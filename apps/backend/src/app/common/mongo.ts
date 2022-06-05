import Debug from 'debug';
import { connect, connection } from 'mongoose';
import { BackendConfiguration } from '../../config/BackendConfiguration';
const debug = Debug("10kc:mongo");

export async function mongoMakeConnection(config: Pick<BackendConfiguration, "MONGO_DB_NAME" | "MONGO_URL">): Promise<void> {
	const MONGO_URL = config.MONGO_URL;
	const MONGO_DB_NAME = config.MONGO_DB_NAME;

	// Don't log the DB credentials
	debug(`Connecting to MongoDB: [mongodb://...]${MONGO_URL.slice(MONGO_URL.indexOf('@'))}`);

	await connect(MONGO_URL, {
		dbName: MONGO_DB_NAME
	});
	debug("Connection to MongoDB Opened: " + MONGO_DB_NAME);

	const db = connection;
	db.on('error', console.error.bind(console, 'MongoDB Connection error:'));
	db.once('open', function () {
		debug("MongoDB Connection Open!");
	});
}