import { Types } from 'mongoose';
import { User } from '../user';
/**
 * Basic userInfo to be sent to the frontend
 */
export class UserInfo implements Pick<User, "_id" | "username">{
	_id: Types.ObjectId;
	username: string;
	static fromUser(user: User): UserInfo{
		const userInfo = new UserInfo();
		userInfo._id = user._id;
		userInfo.username = user.username;
		return userInfo;
	}
}