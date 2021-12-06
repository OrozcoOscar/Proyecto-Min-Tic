import Projects from "../models/projects.model.js";
import Users from "../models/users.model.js";
import Enrollements from "../models/enrollments.model.js";

// constants
import { USER_STATUS, ROLES } from '../constants/user.constants.js';

//ObjectID
import {ObjectId} from 'mongodb';

const allProjects = async (parent, args, { user, errorMessage }) => {
  if(!user) {
    throw new Error(errorMessage);
  }
  if((user.role == ROLES.ADMIN||user.role == ROLES.STUDENT )  &&  user.status !== USER_STATUS.AUTHORIZED) {
    throw new Error('Access denied');
  }

  const projects = await Projects.find();
  return projects;
};

const allProjectsVisual = async (parent, args, { user, errorMessage }) => {
  if(!user) {
    throw new Error(errorMessage);
  }
  if(user.role !== ROLES.LEADER  &&  user.status !== USER_STATUS.AUTHORIZED) {
    throw new Error('Access denied');
  }
  const validationProjectList = await Projects.find({"leader_id":ObjectId(user._id)});
  
  return validationProjectList;
};

const project = async (parent, args) => {
  const user = await Projects.findById(args._id);
  return user;
};

const leader = async (parent) => {
  const user = await Users.findById(parent.leader_id);
  return user;
};

const enrollments = async (parent) => {
  const enrollments = await Enrollements.find({ project_id: parent._id.toString() });
  return enrollments;
}

const createProject = async (parent,{input},{ user, errorMessage }) => {
  if(!user) {
    throw new Error(errorMessage);
    }

  if(user.role !== ROLES.LEADER && user.status !== USER_STATUS.AUTHORIZED ) {
    throw new Error('Access denied');
  }
  
  const project = new Projects({
    ...input,
    status: "INACTIVE",
    leader_id: user._id
   
  });
  return project.save();

}

const updateStatusProject = async (parent,args,{ user, errorMessage }) => {
  if(!user) {
    throw new Error(errorMessage);
    }

  if(user.role !== ROLES.ADMIN && user.status !== USER_STATUS.AUTHORIZED) {
    throw new Error('Access denied');
  }

  var  updateProjects
  const tiempoTranscurrido = Date.now();
  const hoy = new Date(tiempoTranscurrido);

  const proyect = await Projects.findOne({"_id":ObjectId(args._idProject)});

  if(proyect.status == "INACTIVE" && proyect.phase == null){
    updateProjects = Projects.findOneAndUpdate({"_id":ObjectId(args._idProject)},{"status":args.status,"phase":"STARTED","startDate":hoy},{new:true})
  }else if(proyect.phase == "ENDED"){
    throw new Error('NO PUEDE VOLVER A ACTIVAR UN PROYECTO TERMINADO');
  }else{
    updateProjects = Projects.findOneAndUpdate({"_id":ObjectId(args._idProject)},{"status":args.status},{new:true})
  }

  return updateProjects ;  
  }

const updatePhaseProject = async (parent,args,{ user, errorMessage }) => {
  if(!user) {
    throw new Error(errorMessage);
    }

  if(user.role !== ROLES.ADMIN && user.status !== USER_STATUS.AUTHORIZED ) {
    throw new Error('Access denied');
  }

  const tiempoTranscurrido = Date.now();
  const hoy = new Date(tiempoTranscurrido);
  console.log(args)
  var updateProjects
  if(args.phase == "ENDED"){
    updateProjects =  Projects.findOneAndUpdate({"_id":ObjectId(args._idProject)},{"phase":args.phase,"endDate":hoy,"status":"INACTIVE"},{new:true})
  }else{
    updateProjects =  Projects.findOneAndUpdate({"_id":ObjectId(args._idProject)},{"phase":args.phase},{new:true})
  }
  

  return updateProjects ;  
  }

  const updateProject = async (parent,args,{ user, errorMessage }) => {
    if(!user) {
      throw new Error(errorMessage);
      }
  
    if(user.role !== ROLES.LEADER  && user.status !== USER_STATUS.AUTHORIZED) {
      throw new Error('Access denied');
    }

    const proyect = await Projects.findOne({"_id":ObjectId(args._idProject)})

    if(proyect.status == "ACTIVE" && (proyect.leader_id == user._id)){
      const updateProjects =  Projects.findOneAndUpdate({"_id":ObjectId(args._idProject)},args.input,{new:true})
      return updateProjects 
    }else{
      throw new Error("No esta activado el projecto o el lider no pertenece al proyecto");
    }
  }

export default {
  projectQueries: {
    allProjects,
    project,
    allProjectsVisual
  },
  Project: {
    leader,
    enrollments,
  },
  projectMutations:{
    updateStatusProject,
    updatePhaseProject,
    createProject,
    updateProject
    
  }
};
