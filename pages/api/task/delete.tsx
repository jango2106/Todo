import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

export type Input = {
  tasksIds: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session?.user) {
    res.status(401).send({ message: "Unauthorized" });
  }

  const body = JSON.parse(req.body) as Input;

  if (body.tasksIds.length < 1) {
    return res.status(400).send("Bad Request: No taskIds provided");
  }

  const taskCheck = await prisma.task.findMany({
    where: {
      taskList: {
        owner: {
          email: session.user.email ?? "",
        },
      },
      id: {
        in: body.tasksIds,
      },
    },
  });

  if (taskCheck.length !== body.tasksIds.length) {
    return res
      .status(400)
      .send(`Bad Request: Not all task ids belong to ${session.user.email}`);
  }

  await prisma.task.deleteMany({
    where: {
      id: {
        in: body.tasksIds,
      },
    },
  });

  return res.send(`Successfully deleted the following tasks: ${body.tasksIds}`);
}
