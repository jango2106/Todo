import { Button, Card, Label, Select, TextInput } from "flowbite-react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { useState } from "react";
import { FrequencyBase } from "@prisma/client";

const NewTask: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [base, setBase] = useState<FrequencyBase>(FrequencyBase.NONE);
  const [units, setUnits] = useState(0);
  const { taskList } = router.query;

  const createNewTask = async () => {
    await fetch("/api/task/create", {
      method: "POST",
      body: JSON.stringify({ name, base, units, taskList }),
    });
    router.push("/taskList");
  };

  const isSubmitDisabled =
    !name || name.length < 3 || (base !== FrequencyBase.NONE && units === 0);

  return (
    <Layout title="Add New Task">
      <Card>
        <form className="flex flex-col gap-4" onSubmit={null}>
          <div className="flex flex-row">
            <div className="basis-1/2">
              <div className="mb-2 block">
                <Label htmlFor="name" value="Task Name" />
              </div>
              <TextInput
                id="name"
                type="text"
                placeholder="My Cool Task"
                required={true}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex-col basis-1/4">
              <div id="select">
                <div className="mb-2 block">
                  <Label
                    htmlFor="frequencyBase"
                    value="Select repeat frequency"
                  />
                </div>
                <Select
                  id="frequencyBase"
                  required={true}
                  onChange={(e) => {
                    setBase(e.target.value.toUpperCase() as FrequencyBase);
                    if (base === FrequencyBase.NONE) {
                      setUnits(0);
                    }
                  }}
                >
                  {Object.keys(FrequencyBase).map((it) => (
                    <option key={it}>{it.toLowerCase()}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex-col basis-1/4">
              <div className="mb-2 block">
                <Label htmlFor="name" value="Count" />
              </div>
              <TextInput
                id="count"
                type="number"
                placeholder="My Cool Task"
                required={true}
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                disabled={base === "NONE"}
              />
            </div>
          </div>
          <Button disabled={isSubmitDisabled} onClick={createNewTask}>
            Submit
          </Button>
        </form>
      </Card>
    </Layout>
  );
};

export default NewTask;
