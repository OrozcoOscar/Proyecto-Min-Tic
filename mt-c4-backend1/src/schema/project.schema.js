import { gql } from 'apollo-server';

const projectType = gql`
  # Project
  type Project {
    _id: ID!,
    name: String!
    generalObjective: String!
    specificObjectives: [String]!
    budget: Float!
    startDate: String!
    endDate: String!
    leader_id: ID!
    status: ProjectStatus!
    phase: Phase
    leader: User!
    enrollments: [Enrollment]
    advances:[Advance]
  }
`;

const enums = gql`
  # Enum for status values
  enum ProjectStatus {
    ACTIVE
    INACTIVE
  }

  # Enum for phase values
  enum Phase {
    STARTED
    IN PROGRESS
    ENDED
  }
`;

const queries = gql`
  # Query all projects
  type Query {
    allProjects: [Project]
  }

  type Query {
    project(_id: ID): Project
  }

  type Query {
    allProjectsVisual: [Project]
  }
  
`;

const mutations = gql`
  type Mutation {
    updateStatusProject(_idProject: ID!,status: String!): Project!
  }

  type Mutation {
    updatePhaseProject(_idProject: ID!,phase: String!): Project!
  }
  type Mutation {
    createProject(input:RegisterInputProject!): Project!
  }
  type Mutation {
    updateProject(input:RegisterInputProjectUpdate!,_idProject:ID!): Project!
  }
  
`;

const inputs = gql`
input RegisterInputProject {
    name: String!
    generalObjective: String!
    specificObjectives: [String]!
    budget: Float!
}
input RegisterInputProjectUpdate {
  name: String
  generalObjective: String
  specificObjectives: [String]
  budget: Float
}
`;




export default [
  projectType,
  enums,
  queries,
  mutations,
  inputs,
];
