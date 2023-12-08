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
  name: string;
  description: string;
  docker_image: string;
  difficulty_level: "beginner" | "intermediate" | "advanced";
  duration: number;
  image_picture: string;
  prerequisites: string;
  port_number: number;
  image_picture: string
  command: string
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
