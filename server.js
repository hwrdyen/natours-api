const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCALLED EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  // 0: success; 1: uncaught exception
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// connect to Local Database
// mongoose.connect(process.env.DATABASE_LOCAL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
// }).then(() => console.log("Local DB connection successful!"));

// connect to Atlas Database
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));
//   .catch((err) => console.log('ERROR'));

// define a tourSchema
// const tourSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, "A tour must have a name"], // this is a validator
//         unique: true
//     },
//     rating: {
//         type: Number,
//         default: 4.5
//     },
//     price: {
//         type: Number,
//         required: [true, "A tour must have a price"]
//     }
// });
// const Tour = mongoose.model("Tour", tourSchema);

// const testTour = new Tour({
//     name: "The Park Camper",
//     price: 997
// }); // every changes/save will create a new document

// testTour
//     .save()
//     .then(doc => {
//         console.log(doc);
//     })
//     .catch(err => {
//         console.log('ERROR', err);
//     });

// console.log(app.get("env")); // env default is "development"
// console.log(process.env);

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION! Shutting down...');
  console.log(err.name, err.message);
  // 0: success; 1: uncaught exception
  server.close(() => {
    process.exit(1);
  });
});
