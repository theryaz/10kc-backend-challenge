import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import { isObjectIdOrHexString, ObjectId, Types } from "mongoose";
import { Service } from "typedi";
import { InvalidIdError } from '@10kcbackend/errors';
import { Photo } from "./photo";
import { GridFsStorage } from 'multer-gridfs-storage';
import { GridFSBucket } from 'mongodb';

@Service()
export class PhotoRepository{
	private model: ReturnModelType<typeof Photo>;
	private bucket: GridFSBucket;
	constructor(){
		this.model = getModelForClass(Photo);
		this.bucket = new GridFSBucket(this.model.db.db);
	}

	get MulterStorage(){
		return new GridFsStorage({
			db: this.model.db,
			options:{
				bucketName: 'photos',
			}
		});
	}

	async findAll(): Promise<Photo[]>{
		return await this.model.find({});
	}
	async findById(_id: string | ObjectId): Promise<Photo | null>{
		if (!isObjectIdOrHexString(_id)){
			throw new InvalidIdError();
		}
		return await this.model.findOne({ _id });
	}

	async create(photo: Photo): Promise<Photo>{
		return await this.model.create(photo);
	}

	async getPhotoDataFromGridFs(gridfsId: Types.ObjectId){
		if (!isObjectIdOrHexString(gridfsId)) {
			throw new InvalidIdError();
		}
		const stream = this.bucket.openDownloadStream(gridfsId);
		return stream;
	}
}
