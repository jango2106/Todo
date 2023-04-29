import { useRouter } from "next/router";
import { FrequencyBase } from "@prisma/client";
import EditTaskScreen from "../../components/EditTaskScreen";
import Layout from "../../components/Layout";

const NewTask: React.FC = () => {
  const router = useRouter();

  const createNewTask = async (
    name: string,
    base: FrequencyBase,
    units: Number,
    taskList: string
  ) => {
    await fetch("/api/task/create", {
      method: "POST",
      body: JSON.stringify({
        name,
        base,
        units,
        taskList,
      }),
    });
    router.push(`/taskList/${taskList}`);
  };

  return (
    <Layout title="Add New Task">
      <EditTaskScreen onSubmit={createNewTask} />
    </Layout>
  );
};

export default NewTask;
