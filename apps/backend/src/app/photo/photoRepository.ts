import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import { isObjectIdOrHexString, ObjectId, Types } from "mongoose";
import { Service } from "typedi";
import { InvalidIdError } from '@10kcbackend/errors';
import { Photo } from "./photo";
import { GridFsStorage } from 'multer-gridfs-storage';
import { GridFSBucket } from 'mongodb';
import { RequestPagination } from "../common/dtos/RequestPagination";
import Debug from 'debug';
const debug = Debug("10kc:PhotoRepository");

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
	async findByUserId(userId: string | ObjectId, includePrivate: boolean = false): Promise<Photo[]>{
		if (!isObjectIdOrHexString(userId)){
			throw new InvalidIdError();
		}
		const query = { ownerId: userId };
		if (includePrivate === false) {
			query['private'] = false;
		}
		return await this.model.find(query);
	}
	async getPagination({ userId, includePrivate = false, params }: { userId: string, params: RequestPagination, includePrivate: boolean }): Promise<{ total: number, page: number, perPage: number, docs: Photo[] }>{
		if (!isObjectIdOrHexString(userId)){
			throw new InvalidIdError();
		}
		const query = { ownerId: userId };
		if(includePrivate === false){
			query['private'] = false;
		}
		debug("getPagination", { params, Skip: params.Skip })
		const [total, photos] = await Promise.all([
			this.model.count(query),
			this.model.find(query)
				.skip(params.Skip)
				.limit(params.limit)
				.exec(),
		]);
		return { total, page: params.page, perPage: params.limit, docs: photos }
	}
	async deleteById(_id: string | ObjectId): Promise<void>{
		const photo = await this.findById(_id);
		await Promise.all([
			this.model.deleteOne({ _id: photo._id }),
			this.bucket.delete(photo.gridFsId),
		]);
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
