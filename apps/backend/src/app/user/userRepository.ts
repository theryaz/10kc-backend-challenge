import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import { isObjectIdOrHexString, ObjectId } from "mongoose";
import { Service } from "typedi";
import { InvalidIdError } from '@10kcbackend/errors';
import { User } from "./user";

@Service()
export class UserRepository{
	private model: ReturnModelType<typeof User>;
	constructor(){
		this.model = getModelForClass(User);
	}

	async findAll(): Promise<User[]>{
		return await this.model.find({});
	}
	async findById(_id: string | ObjectId): Promise<User | null>{
		if (!isObjectIdOrHexString(_id)){
			throw new InvalidIdError();
		}
		return await this.model.findOne({ _id });
	}

	async findByUsername(username: string): Promise<User | null>{
		return await this.model.findOne({ username });
	}

	async create(user: User): Promise<User>{
		return await this.model.create(user);
	}
}
