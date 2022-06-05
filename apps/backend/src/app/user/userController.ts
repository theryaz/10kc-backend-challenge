import { NextFunction, Router, Request, Response } from "express";
import { UserService } from "./userService";
import { UserRegisterBody } from './dtos/userRegister';
import { Service } from "typedi";
import Debug from "debug";

const debug = Debug("10kc:UserController");

@Service()
export class UserController{
	constructor(
		private userService: UserService,
	){}

	public createRouter(): Router{
		const router = Router();
		// router.get('/user');
		router.get('/login', this.login.bind(this));
		router.post('/register', this.registerUser.bind(this));
		return router;
	}

	async login(req: Request, res: Response, next: NextFunction): Promise<void>{
		try{
			const { username, password } = req.query;
			const { user, token } = await this.userService.login(username as string, password as string);
			res.json({ user, token });
		}catch(e){
			next(e);
		}
	}
	async registerUser(req: Request, res: Response, next: NextFunction): Promise<void>{
		try{
			debug("[registerUser] req.body", req.body);
			const userRegister = new UserRegisterBody();
			userRegister.username = req.body.username;
			userRegister.password = req.body.password;
			userRegister.password_repeat = req.body.password_repeat;
			const errors = await userRegister.validate({ validationError: { target: false } });
			if(errors.length > 0){
				res.status(400).json({ errors });
			}else{
				const { user, token } = await this.userService.registerUser(userRegister);
				res.json({ user, token });
			}
		}catch(e){
			next(e);
		}
	}
}