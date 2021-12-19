import { gql } from 'apollo-server';

const AdvanceType = gql`
  # Advance
  type Advance {
    _id: ID!
    addDate: String
    project: Project
    description: String
    observations: String
    student: User
  }
`;


const queries = gql`
  # Query all Advance
  type Query {
    allAdvance: [Advance]
  }
  type Query {
    allAdvanceProject(_idProject: ID!): [Advance]!
  }
  type Query {
    allAdvanceProjectLeader(_idProject: ID!): [Advance]!
  }
  type Query {
    listarAdvances(idProject: ID!): [Advance]!
  }

`;

const mutations = gql`
  type Mutation {
    registerAdvance(input: RegisterInputAdvances!,_idProject: ID!): Advance!
  }

  type Mutation {
    updateAdvances(input: updateInputAdvances!,idAdvances: ID!): Advance!
  }
  type Mutation {
    updateAdvancesObservaciones(input: updateAdvancesObservaciones!,idAdvance:ID!): Advance!
  }
  
`;

const inputs = gql`

  input RegisterInputAdvances {
    observations: String
    description: String
  }

  input updateInputAdvances {
    observations: String
    description: String
  }

  input updateAdvancesObservaciones {
    observations: String
  }

`;

export default [
  AdvanceType,
  queries,
  mutations,
  inputs,
];
