import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import MainImagePage from "@/app/components/dashboard/main-image-page";

const ImagePage = async () => {

  const session = await getServerSession(authOptions);
  
  // @ts-ignore
  const token = session?.user!.tokens?.access_token;


  return <MainImagePage token={token} />;
};

export default ImagePage;
