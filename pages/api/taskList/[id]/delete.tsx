import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";

export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  const { id } = req.query;
  const taskList = await prisma.taskList.findFirst({
    where: {
      id: id as string,
      owner: {
        email: session.user.email ?? "",
      },
    },
  });

  if (!taskList) {
    return res
      .status(400)
      .send(`Bad Request: No taskList found for id ${id as string}`);
  }

  await prisma.taskList.delete({
    where: {
      id: id as string,
    },
  });

  return res.status(200).send("");
}
