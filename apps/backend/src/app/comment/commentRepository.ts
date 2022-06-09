import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import { isObjectIdOrHexString, ObjectId, Types } from "mongoose";
import { Service } from "typedi";
import { InvalidIdError } from '@10kcbackend/errors';
import { Comment } from "./comment";
import Debug from 'debug';
import { RequestPagination } from "../common/dtos/RequestPagination";
const debug = Debug("10kc:CommentRepository");

@Service()
export class CommentRepository {
	private model: ReturnModelType<typeof Comment>;
	constructor() {
		this.model = getModelForClass(Comment);
	}

	async findByPhotoId(userId: string | ObjectId, includePrivate: boolean = false): Promise<Comment[]> {
		if (!isObjectIdOrHexString(userId)) {
			throw new InvalidIdError();
		}
		const query = { ownerId: userId };
		if (includePrivate === false) {
			query['private'] = false;
		}
		return await this.model.find(query);
	}
	async getPaginationByPhotoId({ photoId, params }: { photoId: string, params: RequestPagination }): Promise<{ total: number, page: number, perPage: number, docs: Comment[] }> {
		if (!isObjectIdOrHexString(photoId)) {
			throw new InvalidIdError();
		}
		const query = { photoId };
		debug("getPagination", { params, Skip: params.Skip })
		const [total, comments] = await Promise.all([
			this.model.count(query),
			this.model.find(query)
				.skip(params.Skip)
				.limit(params.limit)
				.exec(),
		]);
		return { total, page: params.page, perPage: params.limit, docs: comments }
	}

	async addComment({ photoId, text, userId }: {userId: string | ObjectId, photoId: string | ObjectId, text: string}): Promise<Comment> {
		const comment = new Comment();
		if(!isObjectIdOrHexString(photoId)){
			throw new InvalidIdError("Comment photo Id is invalid");
		}
		if(!isObjectIdOrHexString(userId)){
			throw new InvalidIdError("User Id for comment is invalid");
		}
		comment.userId = userId as unknown as Types.ObjectId;
		comment.photoId = photoId as unknown as Types.ObjectId;
		comment.text = text;
		return await this.model.create(comment);
	}
}
