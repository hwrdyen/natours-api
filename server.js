const dotenv = require("dotenv");
dotenv.config({path: "./config.env"});

const app = require("./app");

// console.log(app.get("env")); // env default is "development"
// console.log(process.env);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
