const backButtonMappings = new Map<string, (route: string) => string>([
  ["/taskList/[id]", (_) => "/taskList"],
  [
    "/taskList/[id]/manage",
    (route) => {
      console.log(route);
      console.log(route.replace("/manage", ""));
      return route.replace("/manage", "");
    },
  ],
  ["/taskList/new", (_) => "/taskList"],
  [
    "/task/new",
    (route) => {
      const taskListId = route.split("taskList=")[1];
      return `/taskList/${taskListId}`;
    },
  ],
]);

export { backButtonMappings };
