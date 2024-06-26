import { Session } from "next-auth";

interface IUserProfile {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  avatar: string;
  is_active: boolean;
  is_admin: boolean;
  is_staff: boolean;
  date_joined: string;
  last_login: string | boolean;
  organization_id: string | null;
}

interface ILabImage {
  id: number;
  image?: number;
  name: string;
  description: string;
  docker_image: string;
  difficulty_level: "beginner" | "intermediate" | "advanced";
  duration: number;
  image_picture: string;
  prerequisites: string;
  port_number: number;
  image_picture: string;
  command: string;
  arguments: string;
  readiness_probe_initial_delay_seconds?: number;
  readiness_probe_period_seconds?: number;
  readiness_probe_timeout_seconds?: number;
  readiness_probe_success_threshold?: number;
  readiness_probe_failure_threshold?: number;
  liveness_probe_initial_delay_seconds?: number;
  liveness_probe_period_seconds?: number;
  liveness_probe_timeout_seconds?: number;
  liveness_probe_success_threshold?: number;
  liveness_probe_failure_threshold?: number;
  updated_date?: string;
  sidecar?: boolean;
  tags?: string;
}

interface IinviteData {
  id: number;
  recipient_email: string;
  invitation_status: string;
  created_at: string;
  expires: string;
}

interface IOrgGroupData {
  id: number;
  name: string;
  organization: {
    name: string;
  };
}

interface ILabInfoDialog {
  lab: ILabImage | undefined;
}

interface ILabList {
  id: number;
  name: string;
  status: string;
  deployment_name: string;
  ingress_url: string;
  creation_date: string;
  review: integer;
  comments: string;
  image: integer;
  user: string;
}

type ContentProps = React.ComponentProps<typeof SomeContentPrimitive>;
type Props = {
  onPointerDownOutside: ContentProps["onPointerDownOutside"];
};

interface ILabInfo {
  message: string;
  status: number;
  ingress_url: string;
  lab_id: number;
  image_id: number;
}

interface IActiveLab {
  creation_date: string;
  id: number;
  image: {
    id: number;
    duration: number;
  };
  ingress_url: string;
  name: string;
}

interface IReview {
  comments: string;
  creation_date: string;
  review: string;
  user: IUser;
}

interface IInstruction {
  id: number;
  sequence: number;
  text: string;
  title: string;
}

interface ILabListItem {
  id: number;
  name: string;
  image: number;
  ingress_url: string;
  creation_date: string;
}

interface ISession extends Session {
  user: {
    status: number;
    message: string;
    tokens: {
      refresh_token: string;
      access_token: string;
    };
    data: {
      email: string;
      first_name: string;
      last_name: string;
      username: string;
      avatar: string;
      is_admin: boolean;
      is_superuser: boolean;
      is_active: boolean;
      date_joined: string;
      last_login: string | null;
      organization_id: string | null;
    };
  };
}

interface NoInvitationsResponse {
  message: string;
  status: number;
}

interface InvitationsResponse {
  data: {
    organization: {
      id: string;
      name: string;
      owner: {
        username: string;
      };
    };
    role?: string;
  }[];
  status: number;
}

interface OrganizationGroup {
  data: {
    id: number;
    name: string;
  }[];
}

interface GroupMember {
  invitation_status: string;
  join_date: string;
  member: {
    email: string;
    first_name: string;
    id: string;
    last_name: string;
  };
  role: string;
}

interface Link {
  label: string;
  link: string;
  icon: ReactNode;
  position?: string;
  description: string;
}

interface RouteLinks {
  links: Link[];
}

type Permissions = RouteLinks | RouteLinks | RouteLinks | RouteLinks;

type Role = "Admin" | "Editor" | "Viewer" | "Member";

interface Plan {
  value: string;
  label: string;
  features: string[];
  price: string;
  basicPrice?: number;
  plan_choice: string;
}
