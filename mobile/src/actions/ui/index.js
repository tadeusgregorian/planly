export const openSideNav = (sideNavCont: SideNav) => ({
  type: 'OPEN_SIDE_NAV',
  payload: sideNavCont
})

export const closeSideNav = () => ({
  type: 'CLOSE_SIDE_NAV'
})
