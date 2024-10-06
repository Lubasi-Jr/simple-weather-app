import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const port = 3000;
const app = express();

const bearerToken = ""; //Use your own bearer token

//

const URL = `http://api.weatherapi.com/v1/current.json?key=${bearerToken}&q=`;
const air = `&aqi=no`;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server running and listening on port ${port}`);
});

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.post("/search", async (req, res) => {
  var city = req.body.city;
  city = city.toLowerCase(); //to account for all casing errors
  try {
    const response = await axios.get(URL + city + air);
    const locationName = response.data.location.name;
    // Retrieve the weather condition text
    const weatherText = response.data.current.condition.text;
    // Retrieve the current temperature in degrees Celsius
    const temperatureCelsius = response.data.current.temp_c;
    // Retrieve the wind speed in kph
    const windKph = response.data.current.wind_kph;
    const countryName = response.data.location.country;
    const weatherImage = `http:${response.data.current.condition.icon}`;

    // create an object to be rendered
    const weather = {
      city: `${locationName}, ${countryName}`,
      description: weatherText,
      temp: temperatureCelsius,
      wind: `${windKph} km/h`,
      icon: weatherImage,
    };

    // Output the retrieved values
    console.log(weather);
    console.log(response);

    res.render("index.ejs", { weather: weather });
  } catch (err) {
    const errorMessage = "Sorry, city does not exist";

    //Render the error message under the variable noLocation
    console.log(`Error message: ${errorMessage}`);

    // Log the error to confirm the catch block is being executed
    //console.error("Error occurred:", err);
    res.render("index.ejs", { errorMsg: errorMessage });
  }
});
