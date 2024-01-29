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
  image: number;
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
