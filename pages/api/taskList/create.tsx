import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

type Input = {
  name: string;
};

export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  const body = JSON.parse(req.body) as Input;
  if (session.user) {
    await prisma.taskList.create({
      data: {
        name: body.name,
        owner: {
          connect: {
            email: session.user.email,
          },
        },
      },
    });
    res.send(`Created new task list "${body.name}"`);
  } else {
    res.status(401).send("Unauthorized");
  }
}
