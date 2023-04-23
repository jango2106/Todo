import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import { FrequencyBase } from "@prisma/client";
import moment from "moment";

type Input = {
  base: string;
  name: string;
  taskList: string;
  units: number;
};

export default async function completed(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session?.user) {
    res.status(401).send({ message: "Unauthorized" });
  }

  const body = JSON.parse(req.body) as Input;

  const result = await prisma.task.create({
    data: {
      name: body.name,
      frequencyBase: body.base as FrequencyBase,
      frequencyUnits: body.units,
      taskListId: body.taskList,
      nextScheduledDate: moment.utc().toISOString(),
    },
  });

  return res.send(result);
}
