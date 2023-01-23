const { db } = require("../jest.setup");
const { UserController, RoleController } = require("@rumsan/user");
const ProjectController = require("../../modules/project/project.controller");
const projectC = new ProjectController({ db });


const ProjectToBeCreated = {
    id : 1,
    name: "Wheels",
    startDate : '2022-06-19T17:13:00.000Z',
    endDate : '2023-06-19T17:13:00.000Z',
    owner : 1,
    budget : 1200,
    disbursed : 1000
  };

describe("Project Controller Test Cases", () => {

    it("should create a new Project", async () => {
      const project = await projectC.add(ProjectToBeCreated);
      expect(project.id).toBeDefined();
      expect(project.name).toBe(ProjectToBeCreated.name);
      expect(project.startDate).toBe(ProjectToBeCreated.startDate);
      expect(project.budget).toBe(ProjectToBeCreated.budget);
    });

  });
  