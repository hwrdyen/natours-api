const fs = require("fs");

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// ----- checkID middleware -----
exports.checkID = (req, res, next, val) => {
    console.log(`Tour id is: ${val}`);
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        });
    }
    next();
}

// ----- checkBody middleware -----
exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        })
    }
    next();
}

// ----- getAllTours -----
exports.getAllTours = (req, res) => {
    console.log("req.requestTime: " + req.requestTime);
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    })
}

// ----- getTour -----
exports.getTour = (req, res) => {
    console.log(req.params);
    const id = req.params.id*1;
    const tour = tours.find(el => el.id === id);

    // if (id > tours.length) {}
    // if (!tour) {
    //     return res.status(404).json({
    //         status: "fail",
    //         message: "Invalid ID"
    //     });
    // }

    res.status(200).json({
        status: "success",
        data: {
            tour: tour
        }
    })
}

// ----- createTour -----
exports.createTour = (req, res) => {
    // console.log(req.body);

    const newId = tours[tours.length-1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);

    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        })
    })
}

// ----- updateTour -----
exports.updateTour = (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            tour: '<Updated tour here...>'
        }
    })
}

// ----- deleteTour -----
exports.deleteTour = (req, res) => {
    res.status(204).json({ // don't send any data back because it is deleted
        status: "success",
        data: null
    })
}