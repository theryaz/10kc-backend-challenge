import { NextFunction, Router, Request, Response } from "express";
import { PhotoService } from "./photoService";
import { Service } from "typedi";
import Debug from "debug";
import { jwtAuth } from "../common/middleware/jwtAuth";
import { UserService } from "../user/userService";
import * as multer from 'multer';
import { GridFile } from 'multer-gridfs-storage';
import { PhotoReference } from "./dtos/PhotoReference";

const debug = Debug("10kc:PhotoController");

@Service()
export class PhotoController{
	constructor(
		private photoService: PhotoService,
		private userService: UserService,
	){}

	public createRouter(): Router{
		const router = Router();
		router.get('/full/:photoId', this.getFullsizePhoto.bind(this));
		router.get('/:userId', jwtAuth, this.getPhotosByUserId.bind(this));

		const upload = multer({ storage: this.photoService.getMulterStorageEngine() });
		router.post('/:userId/upload', jwtAuth, upload.any(), this.uploadPhoto.bind(this));
		return router;
	}

	async getPhotosByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { userId } = req.params;
			const user = await this.userService.findById(userId);
			const photos = await this.photoService.findAll();
			res.json({
				user,
				photos: photos.map(p => PhotoReference.fromPhoto(p))
			});
		} catch (e) {
			next(e);
		}
	}

	async getFullsizePhoto(req: Request, res: Response, next: NextFunction): Promise<void>{
		try{
			const { photoId } = req.params;
			const { stream, photo } = await this.photoService.getFullsizePhoto({reqUserId: req.userId, photoId});
			res.setHeader('Content-Type', photo.contentType);
			stream.on('data', (chunk) => {
				res.write(chunk);
			});
			stream.on('error', (e) => {
				console.error("e", e);
				res.sendStatus(404);
			});
			stream.on('end', () => {
				res.end();
			});
		}catch(e){
			next(e);
		}
	}

	async uploadPhoto(req: Request, res: Response, next: NextFunction): Promise<void>{
		try{
			const { userId } = req;
			const privatePhoto = req.query.private !== undefined ? true : false;
			const user = await this.userService.findById(userId);
			const files: GridFile[] = req.files as unknown as GridFile[];
			const newPhotos = await this.photoService.addUserPhotos({
				user, privatePhoto, files
			})
			debug("files", files);
			res.json({ newPhotos });
		}catch(e){
			next(e);
		}
	}
	
}