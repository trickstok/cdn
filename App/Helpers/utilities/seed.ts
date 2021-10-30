import { projectAssignments } from "../../../DB/seeders/projectAssignments";
import { projects } from "../../../DB/seeders/projects";
import { users } from "../../../DB/seeders/users";
import db from "./database";

const createUsers = () => {
  users.map((user) => {
    db.User.create(user);
  });
};

const createProjects = () => {
  projects.map((project) => {
    db.Project.create(project);
  });
};

const createProjectAssignments = () => {
  projectAssignments.map((projectAssignment) => {
    db.ProjectAssignment.create(projectAssignment);
  });
};

// Here paste the functions you want to run, comment them when you don't use them
const seedDb = () => {
  // createUsers();
  // createProjects();
  // createProjectAssignments();
};

export default seedDb;
