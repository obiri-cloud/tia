const permissionsArray = [
    ["admin",  [
      "manage-labs",
      "manage-groups",
      "manage-members",
      "manage-invitation",
      "manage-billing"
    ]],
   
    ["editor",  [
      "edit-labs",
      "edit-groups",
      "edit-members",
      "edit-invitation",
      "edit-billing"
    ]],
   
  ]

const permission=new Map(permissionsArray)
