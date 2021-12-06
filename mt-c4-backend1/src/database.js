import mongoose from 'mongoose';

const connect = () => mongoose.connect("mongodb+srv://Noxiofull:a123@cluster0.jmfiy.mongodb.net/ciclo4-db?retryWrites=true&w=majority", {
  autoIndex: true,
})
  .then(() => console.log('Connected to DB'))
  .catch(err => console.error(err));

export default connect;
