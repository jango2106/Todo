import { TaskList } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import Layout from "../../components/Layout";
import { Button, Card } from "flowbite-react";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const lists = await prisma.taskList.findMany({
    where: {
      owner: {
        email: session.user.email || "",
      },
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return {
    props: { lists },
  };
};

type Props = {
  lists: Partial<TaskList>[];
};

const ToDoLists: React.FC<Props> = (props) => {
  return (
    <Layout title="Available Task Lists">
      <CreateTaskListButton />
      {props.lists.length > 0 ? (
        <ListCards {...props} />
      ) : (
        <p>No task lists available</p>
      )}
      {props.lists.length >= 5 ? <CreateTaskListButton /> : <></>}
    </Layout>
  );
};

const ListCards: React.FC<Props> = (props) => {
  const router = useRouter();

  return (
    <>
      {props.lists.map((it) => (
        <Card
          className="my-3"
          key={it.id}
          onClick={() => router.push(`/taskList/${it.id}`)}
        >
          {it.name}
        </Card>
      ))}
    </>
  );
};

const CreateTaskListButton: React.FC = () => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push("/taskList/new")}
      className="ml-auto mr-0"
      size="sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      New List
    </Button>
  );
};

export default ToDoLists;
