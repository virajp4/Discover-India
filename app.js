const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');

const Spot = require('./models/spot');

mongoose.connect('mongodb://127.0.0.1:27017/discover-rajkot', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/spots', async (req, res) => {
    const spots = await Spot.find({});
    res.render('spots/index', { spots });
});

app.get('/spots/new', (req, res) => {
    res.render('spots/new');
});

app.post('/spots', async (req, res) => {
    const spot = new Spot(req.body.spot);
    await spot.save();
    res.redirect(`/spots/${spot._id}`);
});

app.get('/spots/:id', async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findById(id);
    res.render('Spots/show', { spot });
});

app.get('/spots/:id/edit', async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findById(id);
    res.render('spots/edit', { spot });
});

app.put('/spots/:id', async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findByIdAndUpdate(id, { ...req.body.spot });
    res.redirect(`/spots/${spot._id}`);
});

app.delete('/spots/:id', async (req, res) => {
    const { id } = req.params;
    await Spot.findByIdAndDelete(id);
    res.redirect('/spots');
});
    
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});