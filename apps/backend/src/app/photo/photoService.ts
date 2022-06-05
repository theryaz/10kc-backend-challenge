import { Service } from "typedi";
import { Photo } from "./photo";
import { PhotoRepository } from "./photoRepository";
import { NotFoundError } from "@10kcbackend/errors";
import { User } from "../user/user";
import { GridFile } from 'multer-gridfs-storage'
import { Types } from "mongoose";

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
			throw new NotFoundError("Photo not found");
		}
		const stream = await this.photoRepository.getPhotoDataFromGridFs(photo.gridFsId);
		return {
			photo, stream
		}
	}

	async create(photo: Photo): Promise<Photo>{
		return await this.photoRepository.create(photo);
	}
}