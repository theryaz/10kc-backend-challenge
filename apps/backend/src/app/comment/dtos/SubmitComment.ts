import { IsString, validate, ValidatorOptions } from 'class-validator';
export class SubmitComment {
	public async validate(options: ValidatorOptions) {
		return await validate(this, options);
	}

	@IsString()
	text: string;

	@IsString()
	photoId: string;

}