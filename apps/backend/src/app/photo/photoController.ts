import { NextFunction, Router, Request, Response } from "express";
import { PhotoService } from "./photoService";
import { Service } from "typedi";
import Debug from "debug";
import { jwtAuth } from "../common/middleware/jwtAuth";
import { UserService } from "../user/userService";
import * as multer from 'multer';
import { GridFile } from 'multer-gridfs-storage';
import { PhotoReference } from "./dtos/PhotoReference";
import { UserInfo } from "../user/dtos/UserInfo";
import { RequestPagination } from "./dtos/RequestPagination";
import { BACKEND_CONFIG } from "../../config";

const debug = Debug("10kc:PhotoController");

@Service()
export class PhotoController{
	constructor(
		private photoService: PhotoService,
		private userService: UserService,
	){}

	public createRouter(): Router{
		const router = Router();
		router.get('/full/:photoId', jwtAuth({ authOptional: true }), this.getFullsizePhoto.bind(this));
		router.get('/user/:userId', jwtAuth({ authOptional: true }), this.paginatePhotosByUserId.bind(this));
		router.delete('/all', jwtAuth(), this.deleteAllUserPhotos.bind(this));
		router.delete('/:photoId', jwtAuth(), this.deletePhotoById.bind(this));

		const upload = multer({ storage: this.photoService.getMulterStorageEngine() });
		router.post('/:userId/upload', jwtAuth(), upload.any(), this.uploadPhoto.bind(this));
		return router;
	}

	async paginatePhotosByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { userId: reqUserId } = req;
			const { userId } = req.params;
			const params = RequestPagination.fromParams(req.query);
			const errors = await params.validate({ validationError: { target: false } });
			if(errors.length > 0){
				res.status(400).json({ errors });
				return;
			}
			const user = await this.userService.findById(userId);
			const {docs, total, page, perPage} = await this.photoService.paginatePhotosByUserId({ reqUserId, userId, params });
			res.json({
				user: UserInfo.fromUser(user),
				total,
				page,
				perPage,
				docs: docs.map(p => PhotoReference.fromPhoto(p, BACKEND_CONFIG.BASE_URL)),
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
			res.json({ photos: newPhotos.map(photo => PhotoReference.fromPhoto(photo, BACKEND_CONFIG.BASE_URL)) });
		}catch(e){
			next(e);
		}
	}

	async deletePhotoById(req: Request, res: Response, next: NextFunction): Promise<void>{
		try{
			const { userId } = req;
			const { photoId } = req.params;
			await this.photoService.deleteById({
				photoId,
				reqUserId: userId,
			})
			res.json({ result: "ok" });
		}catch(e){
			next(e);
		}
	}

	async deleteAllUserPhotos(req: Request, res: Response, next: NextFunction): Promise<void>{
		try{
			const { userId } = req;
			const photos = await this.photoService.findUserById({ reqUserId: userId, userId });
			for(const photo of photos){
				debug(`Deleting Photo ${photo._id}...`);
				await this.photoService.deleteById({
					photoId: photo._id.toHexString(),
					reqUserId: userId,
				})
			}
			res.json({ result: photos.length });
		}catch(e){
			next(e);
		}
	}
	
}