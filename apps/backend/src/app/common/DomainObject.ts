import { prop } from "@typegoose/typegoose";
import { Types } from "mongoose";

export class DomainObject{
	@prop() _id: Types.ObjectId = new Types.ObjectId();
}