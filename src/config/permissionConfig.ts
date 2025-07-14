// src/config/permissionsConfig.ts

import { EDepartmentType, EUserActions, EUserStatus, EUserType } from "../types/UserTypes";


export type PermissionRule = {
  rolesAllowed: EUserType[];                    // actor roles allowed to perform action
  actionsAllowed: EUserActions[];
  targetRolesAllowed?: EUserType[] | 'self';   // roles actor can target, or 'self'
  targetDepartmentsAllowed?: EDepartmentType[] | 'same'; // allowed departments or 'same' as actor
  allowedStatusChanges?: { from: EUserStatus; to: EUserStatus }[]; // status change pairs allowed
};

// Declarative permissions rules

export const permissionsConfig: PermissionRule[] = [
  {
    rolesAllowed: [EUserType.ADMIN],
    actionsAllowed: [
        EUserActions.CREATE,
        EUserActions.READ,
        EUserActions.UPDATE,
        EUserActions.DELETE,
        EUserActions.CHANGE_STATUS
    ],
    // Admin can target anyone, any department, any status change
  },
  {
    rolesAllowed: [EUserType.DEPARTMENT_HEAD],
    actionsAllowed: [
        EUserActions.CREATE,
        EUserActions.READ,
        EUserActions.UPDATE,
        EUserActions.DELETE,
        EUserActions.CHANGE_STATUS
    ],
    targetRolesAllowed: [EUserType.GENERAL],
    targetDepartmentsAllowed: 'same', // same department only
    allowedStatusChanges: [{ from: EUserStatus.INACTIVE, to: EUserStatus.ACTIVE }],
  },
  {
    rolesAllowed: [EUserType.GENERAL],
    actionsAllowed: [
        EUserActions.READ,
        EUserActions.UPDATE,
        EUserActions.CHANGE_STATUS
    ],
    targetRolesAllowed: 'self', // only themselves
    allowedStatusChanges: [{ from: EUserStatus.ACTIVE, to: EUserStatus.INACTIVE }],
  },
];
