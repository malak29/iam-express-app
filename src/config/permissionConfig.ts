// src/config/permissionsConfig.ts

import { EDepartmentType, EUserStatus, EUserType } from "../types/UserTypes";


export type PermissionRule = {
  rolesAllowed: EUserType[];                    // actor roles allowed to perform action
  actionsAllowed: ('create' | 'read' | 'update' | 'delete' | 'changeStatus')[];
  targetRolesAllowed?: EUserType[] | 'self';   // roles actor can target, or 'self'
  targetDepartmentsAllowed?: EDepartmentType[] | 'same'; // allowed departments or 'same' as actor
  allowedStatusChanges?: { from: EUserStatus; to: EUserStatus }[]; // status change pairs allowed
};

// Declarative permissions rules

export const permissionsConfig: PermissionRule[] = [
  {
    rolesAllowed: [EUserType.Admin],
    actionsAllowed: ['create', 'read', 'update', 'delete', 'changeStatus'],
    // Admin can target anyone, any department, any status change
  },
  {
    rolesAllowed: [EUserType.DepartmentHead],
    actionsAllowed: ['create', 'read', 'update', 'delete', 'changeStatus'],
    targetRolesAllowed: [EUserType.General],
    targetDepartmentsAllowed: 'same', // same department only
    allowedStatusChanges: [{ from: EUserStatus.Inactive, to: EUserStatus.Active }],
  },
  {
    rolesAllowed: [EUserType.General],
    actionsAllowed: ['read', 'update', 'changeStatus'],
    targetRolesAllowed: 'self', // only themselves
    allowedStatusChanges: [{ from: EUserStatus.Active, to: EUserStatus.Inactive }],
  },
];
