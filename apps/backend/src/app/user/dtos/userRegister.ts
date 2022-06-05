import { IsString, MinLength, validate, ValidatorOptions } from 'class-validator';
export class UserRegisterBody{
	public async validate(options: ValidatorOptions){
		const errors = await validate(this, options);
		if(this.password !== this.password_repeat){
			errors.push({
				"property": "password_repeat",
				"constraints": {
					"mustMatch": "Passwords must match"
				}
			});
		}
		return errors;
	}
	@IsString()
	username: string;

	@MinLength(8, { 
		message: "Password is too short"
	})
	password: string;
	password_repeat: string;
}