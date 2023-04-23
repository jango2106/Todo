import React from "react";
import type { GetStaticProps } from "next";
import Layout from "../components/Layout";
import { PostProps } from "../components/Post";
import { Button, Card } from "flowbite-react";
import prisma from "../lib/prisma";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Login from "../components/Login";
import { Router, useRouter } from "next/router";

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 10,
  };
};

type Props = {
  feed: PostProps[];
};

const Home: React.FC<Props> = (props) => {
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
