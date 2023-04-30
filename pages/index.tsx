import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Home: React.FC = () => {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.data?.user) {
      router.push("/taskList");
    } else {
      router.push("/auth/signin");
    }
  }, []);
  return <></>;
};

export default Home;
