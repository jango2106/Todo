import { Task } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import Layout from "../../components/Layout";
import { Button, Card } from "flowbite-react";
import { useRouter } from "next/router";
import moment from "moment";
import { useState } from "react";

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  res,
}) => {
  const session = await getSession({ req });
  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const taskList = await prisma.taskList.findFirst({
    where: {
      id: params.id as string,
    },
  });
  const tasks = await prisma.task.findMany({
    where: {
      taskListId: params.id as string,
      nextScheduledDate: {
        lte: moment.utc().endOf("day").toISOString(),
      },
    },
    orderBy: {
      lastCompletedDate: "asc",
    },
  });

  return {
    props: {
      id: taskList.id,
      name: taskList.name,
      tasks: tasks.map((it) => ({
        ...it,
        nextScheduledDate: it.nextScheduledDate.toISOString(),
        lastCompletedDate: it.lastCompletedDate.toISOString(),
      })),
    },
  };
};

type Props = {
  id: string;
  name: string;
  tasks: Partial<Task>[];
};

const ToDoLists: React.FC<Props> = (props) => {
  const router = useRouter();
  const [tasks, setTasks] = useState(props.tasks);

  const markTaskComplete = async (id) => {
    await fetch(`/api/task/${id}/completed`, {
      method: "POST",
    });
    setTasks(tasks.filter((it) => it.id !== id));
  };

  return (
    <Layout title="Tasks For Today" subtitle={props.name}>
      <CreateTaskButton taskListId={props.id} />
      {tasks.map((it) => (
        <Card
          className="my-5"
          key={it.id}
          onClick={() => markTaskComplete(it.id)}
        >
          {it.name}
        </Card>
      ))}
      {tasks.length >= 5 ? <CreateTaskButton taskListId={props.id} /> : <></>}
    </Layout>
  );
};

type CreateTaskButtonProps = {
  taskListId: string;
};

const CreateTaskButton: React.FC<CreateTaskButtonProps> = (props) => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push(`/task/new?taskList=${props.taskListId}`)}
      className="ml-auto mr-0"
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
      New Task
    </Button>
  );
};
export default ToDoLists;
