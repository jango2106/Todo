import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";
import * as moment from "moment";

type momentBases = Parameters<typeof moment.duration>[1];

export default async function completed(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  const taskId = req.url.split("/")[3];
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
    },
    include: {
      taskList: {
        include: {
          owner: true,
        },
      },
    },
  });

  if (!task) {
    res.status(404).send({ message: `No task found for id: ${taskId}` });
  }

  if (session && session.user.email === task.taskList.owner.email) {
    if (task.frequencyBase === "NONE") {
      await prisma.task.delete({
        where: {
          id: task.id,
        },
      });
    } else {
      await prisma.task.update({
        where: {
          id: task.id,
        },
        data: {
          lastCompletedDate: moment.utc().toISOString(),
          nextScheduledDate: moment
            .utc()
            .add(
              task.frequencyUnits,
              task.frequencyBase.toLocaleLowerCase() as momentBases
            )
            .startOf("day")
            .toISOString(),
        },
      });
    }
    res.json(`Task ${task.id} marked complete`);
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
}
