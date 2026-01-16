export enum UserRole {
    ADMIN = "admin",
    USER = "user",
    ANONYMOUS = "anonymous",
};

export class User {
    public ID: string;
    public username: string;
    public email: string;
    public authentication: {
        passwordHash: string;
        salt: string;
    };
    public role: UserRole;

    constructor(id: string, username: string, email: string, authentication: { passwordHash: string; salt: string }, role: UserRole = UserRole.USER) {
        this.ID = id;
        this.username = username;
        this.email = email;
        this.authentication = authentication;
        this.role = role;
    }   

    public isAdmin(): boolean {
        return this.role === UserRole.ADMIN;
    }

    public changePassword(newPassword: string): void {
        this.authentication.passwordHash = newPassword;
    }

    public changeRole(newRole: UserRole): void {
        this.role = newRole;
    }

}