//@flow

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
