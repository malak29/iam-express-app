import { permissionsConfig } from "../config/permissionConfig";
import { User } from "../models/User";
import { EUserStatus } from "../types/UserTypes";


type Action = 'create' | 'read' | 'update' | 'delete' | 'changeStatus';

export function canPerformAction(
  actor: User,
  action: Action,
  targetUser?: User,
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

    // Check allowedStatusChanges if action is 'changeStatus'
    if (action === 'changeStatus' && rule.allowedStatusChanges) {
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
