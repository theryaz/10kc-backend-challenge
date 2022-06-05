import { UserService } from './userService';
import { UserRepository } from './userRepository';
import { User } from './user';
import { NotFoundError } from '@10kcbackend/errors';

const mockUser = new User();
mockUser._id;
mockUser.username = "mockuser";

const findAll = jest.fn().mockResolvedValue([mockUser]);
const findById = jest.fn().mockResolvedValue(mockUser);

const mockRepository: UserRepository = {
	findAll,
	findById,
} as unknown as UserRepository;

const userService = new UserService(mockRepository);

describe("UserService", () => {
	describe("findAll", () => {
		it("should return an array of all users", async () => {
			const users = await userService.findAll();
			expect(Array.isArray(users)).toBe(true);
			expect(users.length).toBe(1);
		});
	});
	describe("findById", () => {
		it("should return a user", async () => {
			const user = await userService.findById("629cc7a85d2964c8c7f18f8f");
			expect(user).not.toBeNull();
			expect(user.username).toBe(mockUser.username);
		});
		it("should throw a not found error when the user can't be found", async () => {
			findById.mockResolvedValueOnce(null);
			const userfindById = userService.findById("1234");
			await expect(userfindById).rejects.toBeInstanceOf(NotFoundError)
		});
	});
});