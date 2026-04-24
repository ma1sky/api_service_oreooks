import type { User } from "../config/types.js";
declare class UserRepository {
    getUser(id: number): Promise<User | null>;
    createUser(token: string, tg_id: number): Promise<User>;
}
declare const _default: UserRepository;
export default _default;
//# sourceMappingURL=user.repository.d.ts.map