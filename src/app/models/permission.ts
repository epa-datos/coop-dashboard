export class Permission {
    role_id: number;
    entity_type: string;
    entity_id: number;
}

export class Invite {
    email: string;
    first_name: string;
    last_name: string;
    permissions: Permission[];
}