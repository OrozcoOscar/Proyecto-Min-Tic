// models
import Enrollments from '../models/enrollments.model.js';
import Projects from '../models/projects.model.js';
import Users from '../models/users.model.js';

// constants
import { USER_STATUS, ROLES } from '../constants/user.constants.js';
//ObjectID
import {ObjectId} from 'mongodb';

const allEnrollments = async () => {
  const enrollments = await Enrollments.find();
  return enrollments;
}

const project = async (parent) => {
  const project = await Projects.find({"_id":ObjectId(parent.project_id)});
  return project;
};

const student = async (parent) => {
  const student = await Users.findById(parent.user_id);
  return student;
};

const registerEnrollment = async (parent,args,{ user, errorMessage }) => {
  if(!user) {
    throw new Error(errorMessage);
    }

  if(user.role !== ROLES.STUDENT  && user.status !== USER_STATUS.AUTHORIZED) {
    throw new Error('Access denied');
  }
  
  const tiempoTranscurrido = Date.now();
  const hoy = new Date(tiempoTranscurrido);
  var aux = -1;

  const proyect = await Projects.findOne({"_id":ObjectId(args._idProject)});
  const enrollmentsValidation = await Enrollments.find();

  for(let x of enrollmentsValidation){
    if(x.project_id.equals(args._idProject) && x.user_id.equals(user._id) ){
      aux = 1
      break;
    }else{
      aux = -1
    }
  }
  if(aux == 1){
    throw new Error('Ya esta registrado en este proyecto')
  }else{
    const enrollments = new Enrollments({
      project_id: proyect._id,
      user_id: user._id,
      enrollmentDate: hoy,
    })
    enrollments.save();
    return enrollments ; 
  }
   
  }
  const updateStatusEnrollment = async (parent,args,{ user, errorMessage }) => {
    if(!user) {
      throw new Error(errorMessage);
      }
  
    if(user.role !== ROLES.LEADER  && user.status !== USER_STATUS.AUTHORIZED) {
      throw new Error('Access denied');
    }

    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);

    const enrollments = await Enrollments.findOne({"_id":ObjectId(args._idEnrollment)})
    const proyect = await Projects.findOne({"_id":ObjectId(enrollments.project_id)})
  
    if(proyect.status == "ACTIVE" &&(proyect.leader_id.equals(user._id))){
    if(args.status == "REJECTED"){
      return enrollments.updateOne({"status":args.status})
    }else{
      return enrollments.updateOne({"status":args.status,"egressDate":hoy})
    }
      
    }else{
      throw new Error("Error de autenticacion");
    }
  }
  


export default {
  enrollmentQueries: {
    allEnrollments
  },
  Enrollment: {
    project,
    student,
  },
  enrollmentMutations:{
    registerEnrollment,
    updateStatusEnrollment
  }
}