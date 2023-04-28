import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import { Task } from "@prisma/client";
import Layout from "../../../components/Layout";
import { Accordion, Button, ButtonProps, Card } from "flowbite-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Input } from "../../api/task/delete";

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
    },
    orderBy: {
      name: "asc",
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

const ManageTasks: React.FC<Props> = (props) => {
  const tasks = props.tasks;
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  return (
    <>
      <Layout title="Manage All Tasks" subtitle={props.name}>
        <DeleteSelectedButton
          className="ml-auto"
          selectedTaskIds={selectedTaskIds}
        />
        <Card className="mt-3">
          {tasks.length > 0 ? (
            <TasksAccordion
              tasks={tasks}
              selectedTaskIds={selectedTaskIds}
              onToggleFunction={setSelectedTaskIds}
            />
          ) : (
            <div className="text-lg text-center ">No tasks found</div>
          )}
        </Card>
      </Layout>
    </>
  );
};

type TaskAccordionProps = {
  selectedTaskIds: string[];
  onToggleFunction: (taskIds: string[]) => void;
  tasks: Partial<Task>[];
};

const TasksAccordion: React.FC<TaskAccordionProps> = (props) => {
  const router = useRouter();
  const { selectedTaskIds, onToggleFunction, tasks } = props;
  const toggleCheckbox = (taskId) => {
    if (selectedTaskIds.find((it) => it === taskId)) {
      onToggleFunction(selectedTaskIds.filter((it) => it !== taskId));
    } else {
      onToggleFunction([...selectedTaskIds, taskId]);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/task/delete", {
      method: "POST",
      body: JSON.stringify({ tasksIds: [id] } as Input),
    });
    router.push(router.asPath);
  };

  return (
    <Accordion collapseAll={true}>
      {tasks.map((it) => (
        <Accordion.Panel>
          <Accordion.Title className="w-full bg-slate-300">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    onClick={() => toggleCheckbox(it.id)}
                  ></input>
                  <Button
                    onClick={() => {
                      handleDelete(it.id);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </Button>
                  {it.name}
                </div>
              </div>
            </div>
          </Accordion.Title>
          <Accordion.Content className="bg-slate-100">
            {it.frequencyBase}
          </Accordion.Content>
        </Accordion.Panel>
      ))}
    </Accordion>
  );
};

type DeleteSelectedButtonProps = {
  selectedTaskIds: string[];
} & ButtonProps;

const DeleteSelectedButton: React.FC<DeleteSelectedButtonProps> = (props) => {
  const { selectedTaskIds } = props;

  const router = useRouter();

  const handleOnClick = async () => {
    await fetch("/api/task/delete", {
      method: "POST",
      body: JSON.stringify({ tasksIds: selectedTaskIds } as Input),
    });
    router.reload();
  };

  return (
    <Button
      onClick={() => handleOnClick()}
      className="m-auto mr-0"
      size="sm"
      disabled={props.selectedTaskIds?.length === 0}
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
          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
        />
      </svg>
      Delete Selected
    </Button>
  );
};

export default ManageTasks;
