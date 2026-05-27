import { Outlet } from '@tanstack/react-router'
import MemberManagerDialog from './MemberManager/MemberManagerDialog'
import ClubEditor from './ClubEditor/ClubEditor'
import SquadCreator from './SquadSystem/SquadCreator/SquadCreator'
import SquadEditor from './SquadSystem/SquadEditor/SquadEditor'


const ClubsLayout = () => {
  return (
    <>
      <MemberManagerDialog />
      <ClubEditor />
      <SquadCreator />
      <SquadEditor />
      <Outlet />
    </>
  )
}

export default ClubsLayout
