import {
  GalleryVerticalEndIcon,
  PanelLeft,
  TicketIcon,
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
        },
        {
          label: "Groups",
          link: "/my-organization/groups",
          icon: GalleryVerticalEndIcon,
        },
        {
          label: "Members",
          link: "/my-organization/members",
          icon: Users,
        },
        {
          label: "Invitation",
          link: "/my-organization/invitation",
          icon: TicketIcon,
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
        },
        {
          label: "Groups",
          link: "/my-organization/groups",
          icon: GalleryVerticalEndIcon,
        },
        {
          label: "Members",
          link: "/my-organization/members",
          icon: Users,
        },
        {
          label: "Invitation",
          link: "/my-organization/invitation",
          icon: TicketIcon,
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
        },
        {
          label: "Groups",
          link: "/my-organization/groups",
          icon: GalleryVerticalEndIcon,
        },
        {
          label: "Members",
          link: "/my-organization/members",
          icon: Users,
        },
        {
          label: "Invitation",
          link: "/my-organization/invitation",
          icon: TicketIcon,
        },
      ],
    },
  ],
  [
    "Member",
    {
      links: [
        {
          label: "Labs",
          link: "/my-organization",
          icon: PanelLeft,
        },
      ],
    },
  ],
];

export const permissions: Map<Role, Permissions> = new Map(permissionsArray);
