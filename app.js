// const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// ----- define our own middleware -----
app.use((req, res, next) => {
  // console.log('Hello from the middleware!');
  next(); // have to add next() for middleware to go to next one
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTE HANDLERS
// ----- GET/POST call -----
// app.get('/', (req, res) => {
//     res.status(200).json({
//         message: "Hello from the server side!",
//         app: "Natours"
//     });
// })

// app.post('/', (req, res) => {
//     res.send("You can post to this endpoint...");
// })

// ----- All the created Functions -----
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );

// // ----- getAllTours -----
// const getAllTours = (req, res) => {
//     console.log("req.requestTime: " + req.requestTime);
//     res.status(200).json({
//         status: 'success',
//         results: tours.length,
//         data: {
//             tours: tours
//         }
//     })
// }

// // ----- getTour -----
// const getTour = (req, res) => {
//     console.log(req.params);
//     const id = req.params.id*1;
//     const tour = tours.find(el => el.id === id);

//     // if (id > tours.length) {}
//     if (!tour) {
//         return res.status(404).json({
//             status: "fail",
//             message: "Invalid ID"
//         });
//     }

//     res.status(200).json({
//         status: "success",
//         data: {
//             tour: tour
//         }
//     })
// }

// // ----- createTour -----
// const createTour = (req, res) => {
//     // console.log(req.body);

//     const newId = tours[tours.length-1].id + 1;
//     const newTour = Object.assign({id: newId}, req.body);

//     tours.push(newTour);
//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
//         res.status(201).json({
//             status: "success",
//             data: {
//                 tour: newTour
//             }
//         })
//     })
// }

// // ----- updateTour -----
// const updateTour = (req, res) => {
//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: "fail",
//             message: "Invalid ID"
//         });
//     }

//     res.status(200).json({
//         status: "success",
//         data: {
//             tour: '<Updated tour here...>'
//         }
//     })
// }

// // ----- deleteTour -----
// const deleteTour = (req, res) => {
//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: "fail",
//             message: "Invalid ID"
//         });
//     }

//     res.status(204).json({ // don't send any data back because it is deleted
//         status: "success",
//         data: null
//     })
// }

// const getAllUsers = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: "This route is not yet defined"
//     })
// }
// const createUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: "This route is not yet defined"
//     })
// }
// const getUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: "This route is not yet defined"
//     })
// }
// const updateUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: "This route is not yet defined"
//     })
// }
// const deleteUser = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: "This route is not yet defined"
//     })
// }

// ----- old fashion way of defining routes -----
// app.get('/api/v1/tours', getAllTours);
// app.get("/api/v1/tours/:id", getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3) ROUTES
// ----- use route to reorganize -----
// ----- tourRouter moves to tourRoutes.js -----
// const tourRouter = express.Router();
// tourRouter
//     .route('/')
//     .get(getAllTours)
//     .post(createTour);

// tourRouter
//     .route("/:id")
//     .get(getTour)
//     .patch(updateTour)
//     .delete(deleteTour);

// ----- userRouter moves to userRoutes.js -----
// const userRouter = express.Router();
// app
//     .route('/')
//     .get(getAllUsers)
//     .post(createUser);

// app
//     .route("/:id")
//     .get(getUser)
//     .patch(updateUser)
//     .delete(deleteUser);

// 3) Routes
app.use('/api/v1/tours', tourRouter); // when it enters "/api/v1/tours", it'll run tourRouter
app.use('/api/v1/users', userRouter);

// order matters, if put this at the top, it'll go directly into this 404 * response
// but now it will only go into this 404 * response when it doesnt go into the previous two request
app.all('*', (req, res, next) => {
  // (1) method
  //   res.status(404).json({
  //     status: 'fail',
  //     message: `Can't find ${req.originalUrl} on this server!`,
  //   });

  // (2) method
  //   const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  //   err.status = 'fail';
  //   err.statusCode = 404;

  //if put err inside next(), it'll skip all the middleware and go straight to the error handling middleware directly
  // (3) method
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// error handling middleware => will only be called when there's an error
app.use(globalErrorHandler);

// 4) START SERVER
// const port = 8000
// app.listen(port, () => {
//     console.log(`App running on port ${port}...`);
// })

module.exports = app;
