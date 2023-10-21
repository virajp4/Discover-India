if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const mongoose = require('mongoose');
const { spots } = require('./locations');

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const Spot = require('../models/spot');

mongoose.connect('mongodb://localhost:27017/spotsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Spot.deleteMany({});
    for (const spot of spots) {
        const newSpot = new Spot(spot);
        newSpot.images = [{ url: 'https://res.cloudinary.com/dyw13siqk/image/upload/v1697712875/Discover-Rajkot/kfpxo1ijpgxwd0mezzbc.jpg', filename: 'Discover-Rajkot/w49nqfcksksx8jhwb4wh' }];
        const loc = newSpot.title + ', ' + newSpot.location;
        const geoData = await geocoder.forwardGeocode({
            query: loc,
            limit: 1
        }).send()
        newSpot.geometry = geoData.body.features[0].geometry;
        if (newSpot.title == 'Taj Mahal')
            newSpot.geometry.coordinates = [78.04212956691559, 27.175200523660862]
        await newSpot.save();
    }
}

seedDB().then(() => {
    console.log('Database reset and closing connection')
    mongoose.connection.close();
})