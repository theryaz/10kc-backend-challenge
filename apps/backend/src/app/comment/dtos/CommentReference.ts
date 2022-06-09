import { Types } from 'mongoose';
import { Comment } from '../comment';
/**
 * Basic commentRef to be sent to the frontend
 */
export class CommentReference implements Pick<Comment, "_id" | "userId" | "photoId" | "text">{
	_id: Types.ObjectId;
	userId: Types.ObjectId;
	photoId: Types.ObjectId;
	text: string;
	

	static fromComment(comment: Comment): CommentReference {
		const commentRef = new CommentReference();
		commentRef._id = comment._id;
		commentRef.userId = comment.userId;
		commentRef.photoId = comment.photoId;
		commentRef.text = comment.text;
		return commentRef;
	}
}