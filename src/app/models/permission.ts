export class Permission {
    role_id: number;
    entity_type: string;
    entity_id: number;
}

export class Invite {
    user_email: string;
    permissions: Permission[];
}