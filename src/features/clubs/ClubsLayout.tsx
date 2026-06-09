import { Outlet } from '@tanstack/react-router'
import ClubsDialogs from './ClubsDialogs'

const ClubsLayout = () => (
  <>
    <Outlet />
    <ClubsDialogs />
  </>
)

export default ClubsLayout
