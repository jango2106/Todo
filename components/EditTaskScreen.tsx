import { Button, Card, Label, Select, TextInput } from "flowbite-react";
import { FrequencyBase } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/router";

type EditTaskScreenProps = {
  onSubmit: (
    name: string,
    base: FrequencyBase,
    units: number,
    taskListId?: string
  ) => void;
  currentValues?: {
    name: string;
    base: FrequencyBase;
    units: number;
  };
  showCancel?: boolean;
  onCancel?: () => void;
};

const EditTaskScreen: React.FC<EditTaskScreenProps> = (props) => {
  const { currentValues, onSubmit, onCancel, showCancel } = props;
  const router = useRouter();
  const [name, setName] = useState(currentValues?.name || "");
  const [base, setBase] = useState<FrequencyBase>(
    currentValues?.base || FrequencyBase.DAYS
  );
  const [units, setUnits] = useState(currentValues?.units ?? 0);
  const [hasFrequency, setHasFrequency] = useState(
    !!units || base !== FrequencyBase.NONE ? true : false
  );
  const { taskList } = router.query;

  const isSubmitDisabled =
    !name || name.length < 3 || (base !== FrequencyBase.NONE && units < 1);

  const handleHasFrequencyClick = () => {
    setBase(hasFrequency ? FrequencyBase.NONE : FrequencyBase.DAYS);
    setHasFrequency(!hasFrequency);
  };

  const { NONE, ...frequencyOther } = FrequencyBase;

  const [actualBase, actualUnits] = hasFrequency
    ? [base, units]
    : [FrequencyBase.NONE, 0];

  return (
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
              <Label className="block">Frequency</Label>
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
        <Button
          disabled={isSubmitDisabled}
          onClick={() => props.onSubmit(name, actualBase, actualUnits)}
        >
          Submit
        </Button>
        {showCancel && (
          <Button color="light" onClick={() => props.onCancel()}>
            Cancel
          </Button>
        )}
      </form>
    </Card>
  );
};

export default EditTaskScreen;
