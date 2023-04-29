import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import { Task } from "@prisma/client";
import Layout from "../../../components/Layout";
import { Accordion, Button, ButtonProps, Card } from "flowbite-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Input } from "../../api/task/delete";
import { formatDate, isDateBeforeDefaultTime } from "../../../utils/date";

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
          <Accordion.Title className="bg-slate-300 justify-start">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                onClick={() => toggleCheckbox(it.id)}
              ></input>
              <span>{it.name}</span>
            </div>
          </Accordion.Title>
          <Accordion.Content className="bg-slate-100">
            <div className="flex flex-col flex-wrap w-full">
              <TaskDetailInput
                id={it.id + "-base"}
                title="Frequency:"
                content={it.frequencyBase.toLocaleLowerCase()}
              />
              <TaskDetailInput
                id={it.id + "-count"}
                title="Frequency Count:"
                content={String(it.frequencyUnits)}
              />
              <TaskDetailInput
                id={it.id + "-next"}
                title="Next Scheduled Time:"
                content={formatDate(new Date(it.nextScheduledDate))}
              />

              <TaskDetailInput
                id={it.id + "-last"}
                title="Last Time Completed:"
                content={String(
                  isDateBeforeDefaultTime(it.lastCompletedDate)
                    ? "None"
                    : formatDate(it.lastCompletedDate)
                )}
              />
            </div>
            <div className="flex w-full justify-end mt-5 gap-2">
              <Button
                className="w-full"
                size="sm"
                onClick={() => {
                  null;
                }}
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

                <span className="px-1">Edit</span>
              </Button>
            </div>
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
      color="failure"
      disabled={props.selectedTaskIds?.length === 0}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="mr-1 w-6 h-6"
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

type TaskDetailInpuProps = {
  content: string;
  id: string;
  title: string;
};
const TaskDetailInput: React.FC<TaskDetailInpuProps> = (props) => {
  const { content, id, title } = props;
  return (
    <div className="my-2">
      <label className="block font-bold" htmlFor={id}>
        {title}
      </label>
      <input value={content} id={id} className="border" disabled />
    </div>
  );
};

export default ManageTasks;
