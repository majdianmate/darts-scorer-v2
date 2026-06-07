1. Autentikáció - alap routeok - sign in - sign up - sign out - forgot password
2. Friend system - add - get - remove - get pending - accept - reject

Club system
- Get
- Create/Remove/Update club:
    - név
    - leírás
    - hozzáadás (global, friends, guest)
- Manage members
    - add (global, friends, guest)
    - remove member
- Squad manager
    - Create/Remove/Update
    - Manage members
        - add (global, friends, guest)
        - remove member
- Jogosultságok:
    - Leader
    - Captain
    - Member
    - Guest

    - Leader
        - Club
            - Edit
            - Delete
            - Create Squad
            - Manage members
            - Manage squads
        - Captain
            - Edit
            - Create Squad
            - Manage members
            - Manage squads
        - Member
            - Add members
            - Manage squads
    
- UI
    - Club kártya
        - Dropdown
        - Members
            - Memberlist
                - Memberitem
        - Invites
            - Inviteslist
                - Invitesitem
        - Squads
            - Squadlist
                - Squaditem

CreateClub(CreatedByUser, {name, desc, memberToAdd})
UpdateClub(clubId, {name, desc})
RemoveClub(clubId) - Jogosultság check

AddMember(invitedByUser, User, isGuest)
RemoveMember(memberId) - Jogosultság check

CreateSquad(clubId, createdByMember, {name, color, icon, members})
UpdateSquad(squadId, updatedByMember, {name, color, icon})
RemoveSquad(squadId)

- UserPicker
    - selected
    - onSelect
    - source?
    - locked
    - exclude
    - onSearch