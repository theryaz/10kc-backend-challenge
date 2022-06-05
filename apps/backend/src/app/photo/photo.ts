import { prop } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { DomainObject } from "../common/DomainObject";

export class Photo extends DomainObject {
	/** User's _id field who uploaded this photo */
	@prop({ index: true, type: Types.ObjectId }) ownerId: Types.ObjectId;
	@prop({ default: false }) private: boolean = false;
	@prop({ type: Types.ObjectId }) gridFsId: Types.ObjectId;
	@prop({ type: Number }) size: number;
	@prop({ type: String }) contentType: string;
	@prop({ type: String }) filename: string;

}