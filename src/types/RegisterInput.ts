export default interface RegisterInput {
    calendarToken: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    area?: string;
    showPassword: boolean;
}
