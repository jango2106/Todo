import { Task } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import Layout from "../../../components/Layout";
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
  const [tasks, setTasks] = useState(props.tasks);

  const markTaskComplete = async (id) => {
    await fetch(`/api/task/${id}/completed`, {
      method: "POST",
    });
    setTasks(tasks.filter((it) => it.id !== id));
  };

  return (
    <Layout title="Tasks For Today" subtitle={props.name}>
      <div className="flex gap-2 justify-end">
        <RefreshButton />
        <ManageTasksButton />
        <CreateTaskButton taskListId={props.id} />
      </div>
      {tasks.map((it) => (
        <Card className="my-3" key={it.id}>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              onClick={() => markTaskComplete(it.id)}
            ></input>
            {it.name}
          </div>
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
      className="mr-0"
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
      New Task
    </Button>
  );
};

const RefreshButton: React.FC = () => {
  const router = useRouter();

  return (
    <Button size="sm" onClick={() => router.push(router.asPath)} color="light">
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
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    </Button>
  );
};

const ManageTasksButton: React.FC = () => {
  const router = useRouter();

  return (
    <Button
      size="sm"
      onClick={() => router.push(router.asPath + "/manage")}
      color="light"
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
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        />
      </svg>
      Manage Tasks
    </Button>
  );
};
export default ToDoLists;
