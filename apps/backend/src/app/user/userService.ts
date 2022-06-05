import { createJwt } from '@10kcbackend/crypto';
import { NotFoundError, UnauthorizedError, UsernameTakenError } from '@10kcbackend/errors';
import { Service } from "typedi";
import { JwtPayload } from './dtos/JwtPayload';
import { UserInfo } from './dtos/UserInfo';
import { UserRegisterBody } from './dtos/userRegister';
import { User } from "./user";
import { UserRepository } from "./userRepository";

@Service()
export class UserService{
	constructor(
		private userRepository: UserRepository,
	){}

	async findAll(): Promise<User[]>{
		return this.userRepository.findAll();
	}
	async findById(_id: string): Promise<User>{
		const user = await this.userRepository.findById(_id);
		if (user === null){
			throw new NotFoundError("User not found", { _id });
		}
		return user;
	}
	async create(user: User): Promise<User>{
		return await this.userRepository.create(user);
	}

	async login(username: string, password: string): Promise<{ user: UserInfo, token: string }>{
		const user = await this.userRepository.findByUsername(username);
		const valid = user.verifyPassword(password);
		if(valid === false){
			throw new UnauthorizedError();
		}
		const token = this.createUserJwt(user);
		return { user: UserInfo.fromUser(user), token };
	}

	async registerUser(userRegister: UserRegisterBody): Promise<{ user: UserInfo, token: string }>{
		const existingUser = await this.userRepository.findByUsername(userRegister.username);
		if (existingUser !== null){
			throw new UsernameTakenError();
		}
		const newUser = User.fromRegistration(userRegister);
		const user = await this.create(newUser);
		const token = this.createUserJwt(user);
		return {
			user: UserInfo.fromUser(user),
			token,
		};
	}

	private createUserJwt(user: User): string{
		return createJwt<JwtPayload>({
			userId: user._id.toHexString(),
			username: user.username,
		});
	}
}