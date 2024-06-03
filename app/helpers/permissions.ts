import {
  GalleryVerticalEndIcon,
  PanelLeft,
  TicketIcon,
  User,
  Users,
} from "lucide-react";
import { Permissions, Role } from "../types";

const permissionsArray: [Role, Permissions][] = [
  [
    "Admin",
    {
      links: [
        {
          label: "Labs",
          link: "/my-organization",
          icon: PanelLeft,
          description: "This page shows all the labs in your organizations.",
        },
        {
          label: "Groups",
          link: "/my-organization/groups",
          icon: GalleryVerticalEndIcon,
          description: "This page shows all the groups in your organizations.",
        },
        {
          label: "Members",
          link: "/my-organization/members",

          icon: Users,
          description: "This page shows all the members in your organizations.",
        },
        {
          label: "Invitation",
          link: "/my-organization/invitation",
          icon: TicketIcon,
          description:
            "This page shows all the invitations in your organizations.",
        },
        {
          label: "Organization Account",
          link: "/my-organization/account",
          icon: User,
          position: "bottom",
          description: "This page shows details about the organization",
        },
      ],
    },
  ],
  [
    "Editor",
    {
      links: [
        {
          label: "Labs",
          link: "/my-organization",
          icon: PanelLeft,
          description: "This page shows all the labs in your organizations.",
        },
        {
          label: "Groups",
          link: "/my-organization/groups",
          icon: GalleryVerticalEndIcon,
          description: "This page shows all the groups in your organizations.",
        },
        // {
        //   label: "Members",
        //   link: "/my-organization/members",
        //   icon: Users,
        // },
        {
          label: "Invitation",
          link: "/my-organization/invitation",
          icon: TicketIcon,
          description:
            "This page shows all the invitations in your organizations.",
        },
      ],
    },
  ],
  [
    "Viewer",
    {
      links: [
        {
          label: "Labs",
          link: "/my-organization",
          icon: PanelLeft,
          description: "This page shows all the labs in your organizations.",
        },
        {
          label: "Groups",
          link: "/my-organization/groups",
          icon: GalleryVerticalEndIcon,
          description: "This page shows all the groups in your organizations.",
        },
        {
          label: "Members",
          link: "/my-organization/members",
          icon: Users,
          description: "This page shows all the members in your organizations.",
        },
        {
          label: "Invitation",
          link: "/my-organization/invitation",
          icon: TicketIcon,
          description:
            "This page shows all the invitations in your organizations.",
        },
      ],
    },
  ],
  [
    "Member",
    {
      links: [],
    },
  ],
];

export const permissions: Map<Role, Permissions> = new Map(permissionsArray);
