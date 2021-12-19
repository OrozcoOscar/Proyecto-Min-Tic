// vendors
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// constants
import { USER_STATUS, ROLES } from '../constants/user.constants.js';

// models
import Users from "../models/users.model.js";
import Enrollements from '../models/enrollments.model.js';

//ObjectID
import {ObjectId} from 'mongodb';

const allUsers = async (parent, args, { user, errorMessage }) => {
  if(!user) {
    throw new Error(errorMessage);
  }
  if(user.status !== USER_STATUS.AUTHORIZED){
    throw new Error('Access denied');
  }else if((user.role !== ROLES.ADMIN && user.role !== ROLES.LEADER)) {
    throw new Error('Access denied');
  }
  return await Users.find();
};

const user = async (parent, args, { user, errorMessage }) => {
  if(!user) {
    throw new Error(errorMessage);
  }
  return user;
};

const updateUsers = async (parent,{input},{ user, errorMessage }) => {
  if(!user) {
    throw new Error(errorMessage);
  }
  var updateUser
  if(input.password == null){
     updateUser = Users.findOneAndUpdate({"_id":user._id},{...input,"fullName": `${input.name} ${input.lastName}`},{new:true})
  }else{
    updateUser = Users.findOneAndUpdate({"_id":user._id},{...input,"fullName": `${input.name} ${input.lastName}`,"password": await bcrypt.hash(input.password, 12)},{new:true})
  }
  
  return updateUser ;
};

const updateStatusUsers = async (parent,args,{ user, errorMessage }) => {
  if(!user) {
    throw new Error(errorMessage);
    }

  if((user.role !== ROLES.ADMIN && user.role !== ROLES.LEADER) && user.status !== USER_STATUS.AUTHORIZED) {
    throw new Error('Access denied');
  }  

  let updateUser;
  if(args.status == "UNAUTHORIZED"){
    if(user.role == ROLES.LEADER){
      throw new Error("No tiene autorizacion para realizar dicha accion");
    }else{
      updateUser = Users.findOneAndUpdate({"_id":ObjectId(args._idUser)},{"status":args.status},{new:true})
    }
  }else{
    updateUser = Users.findOneAndUpdate({"_id":ObjectId(args._idUser)},{"status":args.status},{new:true})
  }
    
  return updateUser ;  
  }

const register = async (parent, {input}) => {
  const user = new Users({
    ...input,
    status: USER_STATUS.PENDING,
    fullName: `${input.name} ${input.lastName}`,
    password: await bcrypt.hash(input.password, 12),
    
  });
  return user.save();
};

const userByEmail = async (parent, args) => {
  const user = await Users.findOne({ email: args.email });
  return user;
};

const login = async (parent, args) => {
  const user = await Users.findOne({ email: args.email });
  if (!user) {
    throw new Error('User not found');
  }
  const isValid = await bcrypt.compare(args.password, user.password);
  if(!isValid) {
    throw new Error('Wrong password');
  }
  const token = await jwt.sign(
    { user },
    // eslint-disable-next-line no-undef
    "ashdjhafopqjwiohoakjsdkaskdpkl",
    { expiresIn: '60m' }
  );
  // user.token = token

  return {_id:user.id,token,role:user.role,name:user.name,lastName:user.lastName,documentId:user.documentId,email:user.email};
};

const enrollments = async (parent) => {

  const enrollments = await Enrollements.find({ "user_id": parent._id.toString(),"status":"ACEPTED"});

  return enrollments;
};

export default {
  userQueries: {
    allUsers,
    user,
    userByEmail,
  },
  userMutations: {
    register,
    login,
    updateUsers,
    updateStatusUsers,
  },
  User: {
    enrollments,
  }
}