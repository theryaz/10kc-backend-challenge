import { Service } from "typedi";
import { Comment } from "./comment";
import { CommentRepository } from "./commentRepository";
import { RequestPagination } from "../common/dtos/RequestPagination";
import Debug from 'debug';
import { SubmitComment } from "./dtos/SubmitComment";
import { ObjectId } from "mongoose";
import { PhotoService } from "../photo/photoService";
import { PhotoIsPrivateError } from "@10kcbackend/errors";
const debug = Debug("10kc:CommentService");

@Service()
export class CommentService {
	constructor(
		private commentRepository: CommentRepository,
		private photoService: PhotoService,
	) { }

	async paginateCommentsByPhotoId({ photoId, params }: { photoId: string, params: RequestPagination }): Promise<{ docs: Comment[], total: number, page: number, perPage: number }> {
		const { docs, total, page, perPage } = await this.commentRepository.getPaginationByPhotoId({
			photoId,
			params,
		});
		return {
			docs, total, page, perPage
		};
	}

	async addComment({ userId, validatedComment }: { userId: string | ObjectId, validatedComment: SubmitComment }): Promise<Comment> {
		const { text, photoId } = validatedComment;
		const photo = await this.photoService.findById(photoId);
		if (photo.private === true && photo.ownerId.toHexString() !== userId){
			throw new PhotoIsPrivateError("You can't comment on a private photo");
		}
		return await this.commentRepository.addComment({
			userId, photoId, text
		});
	}

}