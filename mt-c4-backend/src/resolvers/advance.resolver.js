// models
import Enrollments from '../models/enrollments.model.js';
import Projects from '../models/projects.model.js';
import Users from '../models/users.model.js';
import AdvancePlus from '../models/advance.model.js';

import {ObjectId} from 'mongodb'; 

// constants
import { USER_STATUS, ROLES } from '../constants/user.constants.js';

const allAdvance = async (parent,args,{ user, errorMessage }) => {
  return await AdvancePlus.find({"user_id":user._id});
}
const allAdvanceProject = async (parent,args,{ user, errorMessage }) => {
  if(!user) {
    throw new Error(errorMessage);
    }

  if(user.role !== ROLES.STUDENT  && user.status !== USER_STATUS.AUTHORIZED) {
    throw new Error('Access denied');
  }
  let projectAdvance = await AdvancePlus.find({"project_id":ObjectId(args._idProject),"user_id":ObjectId(user._id)});
  return [...projectAdvance];
}

const allAdvanceProjectLeader = async (parent,args,{ user, errorMessage }) => {
  if(!user) {
    throw new Error(errorMessage);
    }

  if(user.role !== ROLES.LEADER  && user.status !== USER_STATUS.AUTHORIZED) {
    throw new Error('Access denied');
  }

  let projectAdvanceLeader = await AdvancePlus.find({"project_id":ObjectId(args._idProject)});
  return [...projectAdvanceLeader];
}
const listarAdvances = async (parent,args,{ user, errorMessage }) => {
  if(!user) {
    throw new Error(errorMessage);
    }

  if(user.role !== ROLES.LEADER  && user.status !== USER_STATUS.AUTHORIZED) {
    throw new Error('Access denied');
  }

  let buscarDatos = await AdvancePlus.find({"project_id":ObjectId(args.idProject)});
  return buscarDatos;
}


const project = async (parent) => {
  const project = await Projects.findById(parent.project_id);
  return project;
};

const student = async (parent) => {
  const student = await Users.findById(parent.user_id);
  return student;
};

const registerAdvance = async (parent,input,{ user, errorMessage }) => {
  if(!user) {
    throw new Error(errorMessage);
    }

  if(user.role !== ROLES.STUDENT  && user.status !== USER_STATUS.AUTHORIZED) {
    throw new Error('Access denied');
  }
  const tiempoTranscurrido = Date.now();
  const hoy = new Date(tiempoTranscurrido);

  var advances;
  var aux = -1;
  const proyect = await Projects.findOne({"_id":ObjectId(input._idProject)});
  const validationUserProyect = await Enrollments.find({"project_id" :ObjectId(proyect._id)})
  //RECORRER JSON
  for(let x of validationUserProyect){
    if(x.user_id.equals(user._id) ){
      aux = 1
      break;
    }else{
      aux = -1
    }
  }
  if(aux != -1){
    advances = new AdvancePlus({
      project_id: proyect._id,
      user_id: user._id,
      addDate: hoy,
      description: input.input.description,
      observations: input.input.observations
    })
    
    advances.save();
  }else{
    throw new Error('No se encuentra registrado en ningun projecto')
  }
   return advances;
  }

  const updateAdvances = async (parent,args,{ user, errorMessage }) => {
    if(!user) {
      throw new Error(errorMessage);
      }
  
    if(user.role !== ROLES.STUDENT  && user.status !== USER_STATUS.AUTHORIZED) {
      throw new Error('Access denied');
    }
    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);
    const updateAdvancesInput = AdvancePlus.findOneAndUpdate({"_id":ObjectId(args.idAdvances)},{...args.input,"addDate":hoy},{new:true})
  
    return updateAdvancesInput;  
    }

    const updateAdvancesObservaciones = async (parent,args,{ user, errorMessage }) => {
      if(!user) {
        throw new Error(errorMessage);
        }
    
      if(user.role !== ROLES.LEADER  && user.status !== USER_STATUS.AUTHORIZED) {
        throw new Error('Access denied');
      }
    
      const advance = await AdvancePlus.findOne({"_id":ObjectId(args.idAdvance)})
      const proyect = await Projects.findOne({"_id":ObjectId(advance.project_id)})

      if(proyect.status == "ACTIVE" &&(proyect.leader_id.equals(user._id))){
        const probando =  AdvancePlus.findOneAndUpdate({"_id":ObjectId(args.idAdvance)},args.input,{new:true})
        return  probando  
      }else{
        throw new Error("Error de autenticacion ");
      }
    }

export default {
  advanceQueries: {
    allAdvance,
    allAdvanceProject,
    allAdvanceProjectLeader,
    listarAdvances
  },
  Advance: {
    project,
    student,
  },
  advanceMutations:{
    registerAdvance,
    updateAdvances,
    updateAdvancesObservaciones,
  }
}