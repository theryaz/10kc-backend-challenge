import { prop } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { DomainObject } from "../common/DomainObject";

export class Comment extends DomainObject {
	/** User who posted the comment */
	@prop({ type: Types.ObjectId }) userId: Types.ObjectId;
	/** The photo this comment is attached to */
	@prop({ index: true, type: Types.ObjectId }) photoId: Types.ObjectId;
	/** The comment text */
	@prop({ type: String }) text: string;

}