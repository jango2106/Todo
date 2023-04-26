import React from "react";
import type { GetStaticProps } from "next";
import Layout from "../components/Layout";
import { useSession } from "next-auth/react";
import Login from "../components/Login";
import { useRouter } from "next/router";

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 10,
  };
};

const Home: React.FC = () => {
  const session = useSession();
  const router = useRouter();
  if (session.data?.user) {
    router.push("/taskList");
  }
  return (
    <Layout title="">
      <div className="page">
        <main className="h-screen flex justify-center items-center">
          {session.data ? <></> : <Login />}
        </main>
      </div>
    </Layout>
  );
};

export default Home;
