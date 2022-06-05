import { UserService } from './userService';
import { UserRepository } from './userRepository';
import { User } from './user';
import { NotFoundError, UnauthorizedError } from '@10kcbackend/errors';

const mockUser = new User();
const mockPassword = "abc123456789";
mockUser._id;
mockUser.username = "mockuser";
mockUser.setPassword(mockPassword);

const findAll = jest.fn().mockResolvedValue([mockUser]);
const findById = jest.fn().mockResolvedValue(mockUser);
const findByUsername = jest.fn().mockResolvedValue(mockUser);

const mockRepository: UserRepository = {
	findAll,
	findById,
	findByUsername,
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

	describe("login", () => {
		it("should login if the correct password is provided", async () => {
			const { user, token } = await userService.login(mockUser.username, mockPassword);
			expect(user._id).toBe(mockUser._id);
			expect(user.username).toBe(mockUser.username);
			expect(typeof token === "string").toBe(true);
		});
		it("should fail to login if the incorrect password is provided", async () => {
			const login = userService.login(mockUser.username, `${mockPassword}1`);
			await expect(login).rejects.toBeInstanceOf(UnauthorizedError);
		});
		it("should fail to login if a missing username is provided", async () => {
			findByUsername.mockResolvedValueOnce(null);
			const login = userService.login(`${mockUser.username}123`, mockPassword);
			await expect(login).rejects.toBeInstanceOf(UnauthorizedError);
		});
	});
});