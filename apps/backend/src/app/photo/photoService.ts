import { Service } from "typedi";
import { Photo } from "./photo";
import { PhotoRepository } from "./photoRepository";
import { NotFoundError, PhotoIsPrivateError } from "@10kcbackend/errors";
import { User } from "../user/user";
import { GridFile } from 'multer-gridfs-storage'
import { Types } from "mongoose";
import { RequestPagination } from "../common/dtos/RequestPagination";
import Debug from 'debug';
const debug = Debug("10kc:PhotoService");

@Service()
export class PhotoService{
	constructor(
		private photoRepository: PhotoRepository,
	){}

	getMulterStorageEngine(){
		return this.photoRepository.MulterStorage;
	}

	async findAll(): Promise<Photo[]>{
		return this.photoRepository.findAll();
	}
	async findById(_id: string): Promise<Photo>{
		const photo = await this.photoRepository.findById(_id);
		if (photo === null){
			throw new NotFoundError("Photo not found", { _id });
		}
		return photo;
	}
	async findUserById({ reqUserId, userId }: {reqUserId:string, userId: string}): Promise<Photo[]>{
		const includePrivate = reqUserId === userId;
		const photos = await this.photoRepository.findByUserId(userId, includePrivate);
		return photos;
	}
	async paginatePhotosByUserId({ reqUserId, userId, params }: {reqUserId:string, userId: string, params: RequestPagination}): Promise<{ docs: Photo[], total: number, page: number, perPage: number }>{
		const includePrivate = reqUserId === userId;
		const {docs, total, page, perPage} = await this.photoRepository.getPagination({
			includePrivate,
			userId,
			params,
		});
		return {
			docs, total, page, perPage
		};
	}

	/**
	 * Associates saved files with a given user
	 */
	async addUserPhotos({ user, files, privatePhoto }: { user: User, files: GridFile[], privatePhoto: boolean }): Promise<Photo[]>{
		const photos = files.map(f => this.photoFromFile(user._id, privatePhoto, f));
		return await Promise.all(photos.map(photo => {
			return this.create(photo);
		}));
	}

	private photoFromFile(userId: Types.ObjectId, privatePhoto: boolean, file: GridFile): Photo{
		const photo = new Photo();
		photo.ownerId = userId;
		photo.private = privatePhoto;
		photo.gridFsId = file.id;
		photo.size = file.size;
		photo.contentType = file.contentType;
		photo.filename = file.filename;
		return photo;
	}

	async getFullsizePhoto({ reqUserId, photoId }: { reqUserId: string, photoId: string }){
		const photo = await this.findById(photoId);
		if(photo.ownerId.toHexString() !== reqUserId && photo.private === true){
			debug("getFullsizePhoto not returning photo since it's private", { reqUserId, ownerId: photo.ownerId });
			throw new PhotoIsPrivateError();
		}
		const stream = await this.photoRepository.getPhotoDataFromGridFs(photo.gridFsId);
		return {
			photo, stream
		}
	}

	async create(photo: Photo): Promise<Photo>{
		return await this.photoRepository.create(photo);
	}

	async deleteById({ photoId, reqUserId }: {reqUserId: string, photoId: string}): Promise<void>{
		const { isOwner } = await this.userIsOwner(reqUserId, photoId);
		if (isOwner === false){
			throw new NotFoundError();
		}
		await this.photoRepository.deleteById(photoId);
	}
	
	private async userIsOwner(userId: string, photoId: string): Promise<{isOwner: boolean}>{
		const photo = await this.findById(photoId);
		return {
			isOwner: photo.ownerId.toHexString() === userId,
		};
	}
}