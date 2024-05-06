import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import MainImagePage from "@/app/components/dashboard/main-image-page";

const ImagePage = async () => {
  const session = await getServerSession(authOptions);

  const token = session?.user!.tokens?.access_token ?? ""; 
  let labCreationUrl = "/user/lab/create/";
  let redirectUrl= '/dashboard/labs'

  return <MainImagePage token={token} labCreationUrl={labCreationUrl} redirectUrl={redirectUrl}/>;
};

export default ImagePage;
