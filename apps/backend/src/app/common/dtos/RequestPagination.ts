import { IsNumber, Max, Min, validate, ValidatorOptions } from "class-validator";

/**
 * Basic photoRef to be sent to the frontend
 */
export class RequestPagination{
	static fromParams(params: Record<string, unknown>): RequestPagination{
		const pagination = Object.assign(new RequestPagination(), params);
		pagination.limit = +pagination.limit;
		pagination.page = +pagination.page;
		return pagination;
	}
	public async validate(options: ValidatorOptions) {
		const errors = await validate(this, options);
		return errors;
	}
	@IsNumber()
	@Min(1)
	page: number = 1;

	@IsNumber()
	@Min(1)
	@Max(1000)
	limit: number = 5;

	/**
	 * Computes number of documents to skip in query counting docs per page by number of pages
	 */
	get Skip(): number{
		return (this.page - 1) * this.limit;
	}
}