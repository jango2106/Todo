import { Button, Card, Label, Select, TextInput } from "flowbite-react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { useState } from "react";
import { FrequencyBase } from "@prisma/client";

const NewTask: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [base, setBase] = useState<FrequencyBase>(FrequencyBase.DAYS);
  const [units, setUnits] = useState(1);
  const [hasFrequency, setHasFrequency] = useState(true);
  const { taskList } = router.query;

  const createNewTask = async () => {
    const [actualBase, actualUnits] = hasFrequency
      ? [base, units]
      : [FrequencyBase.NONE, 0];
    await fetch("/api/task/create", {
      method: "POST",
      body: JSON.stringify({
        name,
        base: actualBase,
        units: actualUnits,
        taskList,
      }),
    });
    router.push(`/taskList/${taskList}`);
  };

  const isSubmitDisabled =
    !name || name.length < 3 || (base !== FrequencyBase.NONE && units === 0);

  const handleHasFrequencyClick = () => {
    setHasFrequency(!hasFrequency);
  };

  const { NONE, ...frequencyOther } = FrequencyBase;

  return (
    <Layout title="Add New Task">
      <Card>
        <form className="flex flex-col gap-4" onSubmit={null}>
          <div className=" flex-row">
            <Label htmlFor="name" value="Task Name" className="mb-2 block" />
            <TextInput
              id="name"
              type="text"
              placeholder="My Cool Task"
              required={true}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label className="block">Repeats?</Label>
            <input
              type="checkbox"
              checked={hasFrequency}
              onChange={() => handleHasFrequencyClick()}
            ></input>
          </div>
          {hasFrequency ? (
            <div className="flex flex-row gap-2">
              <div>
                <Label className="block">Repeats?</Label>
                <div
                  id="task-frequency"
                  className="flex flex-row mt-2 items-center"
                >
                  <span className="italic mr-1">Every</span>

                  <TextInput
                    id="count"
                    type="number"
                    placeholder="My Cool Task"
                    required={true}
                    value={units}
                    onChange={(e) => setUnits(Number(e.target.value))}
                    disabled={base === "NONE"}
                    className="mr-1"
                  />
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
                    {Object.keys(frequencyOther).map((it) => (
                      <option key={it}>{it.toLowerCase()}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          <Button disabled={isSubmitDisabled} onClick={createNewTask}>
            Submit
          </Button>
        </form>
      </Card>
    </Layout>
  );
};

export default NewTask;
