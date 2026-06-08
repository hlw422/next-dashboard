// 角色权限检查工具

import { UserRole } from '@/types/auth'

// 权限矩阵
export const PERMISSIONS = {
  // 浏览网站：所有人可访问
  VIEW_SITES: ['admin', 'editor', 'viewer'] as UserRole[],
  
  // 添加网站：admin 和 editor
  ADD_SITES: ['admin', 'editor'] as UserRole[],
  
  // 编辑网站：admin 和 editor
  EDIT_SITES: ['admin', 'editor'] as UserRole[],
  
  // 删除网站：仅 admin
  DELETE_SITES: ['admin'] as UserRole[],
  
  // 管理用户：仅 admin
  MANAGE_USERS: ['admin'] as UserRole[],
} as const

// 检查用户是否有特定权限
export function hasPermission(userRole: UserRole | undefined, permission: keyof typeof PERMISSIONS): boolean {
  if (!userRole) return false
  return PERMISSIONS[permission].includes(userRole)
}

// 检查用户是否可以管理网站
export function canManageSites(userRole: UserRole | undefined): boolean {
  return hasPermission(userRole, 'ADD_SITES')
}

// 检查用户是否可以删除网站
export function canDeleteSites(userRole: UserRole | undefined): boolean {
  return hasPermission(userRole, 'DELETE_SITES')
}

// 检查用户是否可以管理用户
export function canManageUsers(userRole: UserRole | undefined): boolean {
  return hasPermission(userRole, 'MANAGE_USERS')
}

// 获取角色显示名称
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    admin: '管理员',
    editor: '编辑者',
    viewer: '查看者',
  }
  return roleNames[role]
}

// 获取角色颜色
export function getRoleColor(role: UserRole): string {
  const roleColors: Record<UserRole, string> = {
    admin: 'text-red-400',
    editor: 'text-blue-400',
    viewer: 'text-gray-400',
  }
  return roleColors[role]
}
