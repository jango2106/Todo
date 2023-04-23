import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { useState } from "react";

const NewToDoList: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");

  const createNewTaskList = async () => {
    await fetch("/api/taskList/create", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    router.push("/taskList");
  };

  return (
    <Layout title="Add New Task List">
      <Card>
        <form className="flex flex-col gap-4" onSubmit={null}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Task List Name" />
            </div>
            <TextInput
              id="name"
              type="text"
              placeholder="My Cool Task List"
              required={true}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Button
            disabled={!name || name.length < 3}
            onClick={createNewTaskList}
          >
            Submit
          </Button>
        </form>
      </Card>
    </Layout>
  );
};

export default NewToDoList;
