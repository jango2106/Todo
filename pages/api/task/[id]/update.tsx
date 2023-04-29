import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";
import { FrequencyBase } from "@prisma/client";
import moment from "moment";

type momentBases = Parameters<typeof moment.duration>[1];

export type UpdateTaskInput = {
  name?: string;
  base?: FrequencyBase;
  units?: number;
  taskListId?: string;
};

export default async function update(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  const taskId = req.url.split("/")[3];
  const body = JSON.parse(req.body) as UpdateTaskInput;

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      taskList: {
        owner: {
          email: session.user.email ?? "",
        },
      },
    },
  });

  if (!task) {
    return res.status(404).send(`Not Found: Not task found by id ${taskId}`);
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      name: body?.name ?? task.name,
      frequencyBase: body?.base ?? task.frequencyBase,
      frequencyUnits: body?.units ?? task.frequencyUnits,
      taskList: {
        connect: {
          id: body?.taskListId ?? task.taskListId,
        },
      },
      nextScheduledDate: moment
        .utc()
        .add(
          body?.units ?? task.frequencyUnits,
          (body?.base?.toLowerCase() ??
            task.frequencyBase.toLowerCase()) as momentBases
        )
        .toISOString(),
    },
  });

  return res.send(JSON.stringify(updatedTask));
}
