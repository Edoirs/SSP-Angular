export interface ChangeUserActivityInterface {
  userId: number
  userType: string
  status: boolean
}

export interface ChangeUserRoleInterface {
  userId: number
  userRole: string
}

export interface AllUsersResInterface {
  userId: number
  userTypeId: number
  userTypeName: string
  userName: string
  status: string
}
