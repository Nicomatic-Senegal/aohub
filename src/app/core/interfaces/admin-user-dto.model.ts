class AdminUserDTO {
  id?: number;
  login!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  phoneNumber!: string;
  imageUrl?: string;
  langKey?: string;
  employeePostTitle?: string;
}

export { AdminUserDTO };
