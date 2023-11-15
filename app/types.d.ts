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
}

interface ILabInfoDialog{
  lab: ILabImage | undefined
}