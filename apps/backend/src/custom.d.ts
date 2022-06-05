declare namespace Express {
	export interface Request {
		/** userId from requesting JWT */
		userId: string,
		/** username from requesting JWT */
		username: string,
	}
}