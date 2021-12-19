import mongoose from 'mongoose';
const { Schema } = mongoose;

const projectsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  generalObjective: {
    type: String,
    required: true,
  },
  specificObjectives: {
    type: [],
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  leader_id: {
    type: Schema.ObjectId,
    required: true,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    required: true,
  },
  phase: {
    type: String,
    enum: ['STARTED', 'IN PROGRESS','ENDED','ESPERANDO'],
  }
});

const Projects = new mongoose.model('projects', projectsSchema);

export default Projects;