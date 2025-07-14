import { permissionsConfig } from "../config/permissionConfig";
import { EUserActions, EUserStatus, IUser } from "../types/UserTypes";

const { CREATE, READ, UPDATE, DELETE, CHANGE_STATUS } = EUserActions

export function canPerformAction(
  actor: IUser,
  action: EUserActions,
  targetUser?: IUser,
  newStatus?: EUserStatus
): boolean {
  const actorRole = actor.userType;
  const actorDept = actor.department;

  // Find permission rules matching the actor role and requested action
  const applicableRules = permissionsConfig.filter(
    (rule) =>
      rule.rolesAllowed.includes(actorRole) &&
      rule.actionsAllowed.includes(action)
  );

  if (applicableRules.length === 0) return false;

  // Evaluate each applicable rule for permission
  for (const rule of applicableRules) {
    // Check targetRolesAllowed
    if (rule.targetRolesAllowed) {
      if (rule.targetRolesAllowed === 'self') {
        if (!targetUser || actor.id !== targetUser.id) continue;
      } else if (
        targetUser &&
        !rule.targetRolesAllowed.includes(targetUser.userType)
      ) {
        continue;
      }
    }

    // Check targetDepartmentsAllowed
    if (rule.targetDepartmentsAllowed) {
      if (rule.targetDepartmentsAllowed === 'same') {
        if (!targetUser || actorDept !== targetUser.department) continue;
      } else if (
        targetUser &&
        !rule.targetDepartmentsAllowed.includes(targetUser.department)
      ) {
        continue;
      }
    }

    // Check allowedStatusChanges if action is 'CHANGE_STATUS'
    if (action === CHANGE_STATUS && rule.allowedStatusChanges) {
      if (!targetUser || !newStatus) continue;

      const currentStatus = targetUser.status;
      const isAllowedChange = rule.allowedStatusChanges.some(
        (change) => change.from === currentStatus && change.to === newStatus
      );
      if (!isAllowedChange) continue;
    }

    // ✅ If all checks passed, permission granted
    return true;
  }

  // ❌ No rule matched fully
  return false;
}
