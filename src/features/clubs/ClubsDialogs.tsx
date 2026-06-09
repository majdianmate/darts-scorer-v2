import ClubEditor from './ClubEditor/ClubEditor'
import MemberManagerDialog from './MemberManager/MemberManagerDialog'
import SquadCreator from './SquadSystem/SquadCreator/SquadCreator'
import SquadEditor from './SquadSystem/SquadEditor/SquadEditor'

const ClubsDialogs = () => (
  <>
    <MemberManagerDialog />
    <ClubEditor />
    <SquadCreator />
    <SquadEditor />
  </>
)

export default ClubsDialogs
