//@flow

type branchType = { id: string, name: string, color: string }
type positionType = { id: string, name: string, color: string }
export type userType = {
  id: string,
  name: string,
  color: string,
  position: string,
  branches: {},
  email: string,
  weeklyHours: {},
  status: 'notInvited' | 'invited' | 'active'
}

export type storeType = {
  core: {
    users: [userType],
    positions: [positionType],
    branches: [branchType]
  }
}
