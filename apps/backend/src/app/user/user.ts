import { Service } from 'typedi';
import { prop } from "@typegoose/typegoose";
import { randomString, sha256, safeCompare } from '@10kcbackend/crypto'
import { DomainObject } from "../common/DomainObject";
import { UserRegisterBody } from './dtos/userRegister';
 
@Service()
export class User extends DomainObject{
	@prop({ index: true }) username: string;
	@prop() private password: string;
	@prop({ default: () => randomString(16) }) private passwordSalt: string = randomString(16);

	public setPassword(rawPassword: string): void{
		this.password = User.hashPassword(rawPassword, this.passwordSalt);
	}
	public verifyPassword(rawPassword: string): boolean{
		return safeCompare(this.password, User.hashPassword(rawPassword, this.passwordSalt));
	}

	public static hashPassword(password: string, passwordSalt: string): string{
		return sha256(`${password}${passwordSalt}`);
	}

	/**
	 * Creates a new user from UserRegisterBody. This assumes the body has already been validated
	 */
	public static fromRegistration(userRegister: UserRegisterBody): User{
		const user = new User();
		user.username = userRegister.username;
		user.setPassword(userRegister.password);
		return user;
	}
}