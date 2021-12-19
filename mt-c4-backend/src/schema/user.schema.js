import { gql } from 'apollo-server';

const userType = gql`
  # User
  type User {
    _id: ID!
    email: String!
    documentId: Float!
    name: String!
    lastName: String!
    fullName: String!
    role: UserRole!
    status: UserStatus!
    enrollments: [Enrollment]
    Project:[Project]
  }
  type UserToken {
    _id: ID!
    token: String!
    role: UserRole!
    email: String
    documentId: Float
    name: String
    lastName: String

  }
`;

const enums = gql`
  # Enum for role values
  enum UserRole {
    ADMIN
    LEADER
    STUDENT
  }

  # Enum for status values
  enum UserStatus {
    PENDING
    AUTHORIZED
    UNAUTHORIZED
  }
`;

const queries = gql`
  # Query all users
  type Query {
    allUsers: [User]
  }

  type Query {
    userById(_id: ID!): User
  }

  type Query {
    user: User!
  }

  type Query {
    userByEmail(email: String!): User
  }
`;

const mutations = gql`
  type Mutation {
    register(input: RegisterInput!): User!
  }

  type Mutation {
    login(email: String!, password: String!): UserToken!
  }

  type Mutation {
    updateUsers(input: ModificarInput!): User!
  }

  type Mutation {
    updateStatusUsers(_idUser: ID!,status: String!): User!
  }
`;

const inputs = gql`
  input RegisterInput {
    email: String!
    documentId: Float!
    name: String!
    lastName: String!
    role: UserRole!
    password: String!
  }
  input ModificarInput {
    email: String
    documentId: Float
    name: String
    lastName: String
    password: String
  }
`;

export default [
  userType,
  enums,
  queries,
  mutations,
  inputs,
];
