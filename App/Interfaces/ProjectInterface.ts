interface ProjectAttributes {
  id: number;
  title: string;
  status: string;
}

interface ProjectAssignmentAttributes {
  projectId: number;
  userId: string;
}

export { ProjectAttributes, ProjectAssignmentAttributes };
