import { AdminUserDTO } from "./admin-user-dto.model";

class ManagedUserVM extends AdminUserDTO {
  password!: string;
  enterpriseName!: string;
}

export { ManagedUserVM };
