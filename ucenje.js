const config = require('config');
const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());
const courses = [
    { id: 1, name: 'course1'},
    { id: 2, name: 'course2'},
    { id: 3, name: 'course3'}
];

app.set('view engine', 'pug')
app.set('views', './views') // default

app.get('/', (req, res) => {
    res.render('index', { title: 'My express app', message: 'Message'})
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {
    // Validacija poslanog requesta, ne smijes zivotinjama dat da svasta upisuju
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);
       

    const course = {
        id: courses.length +1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
})

app.put('/api/courses/:id', (req, res) => {
    //Look up the course, if not existing return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Nema ga');
    //validate, if invalid 400- bad request
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //update course, return the updated course
    course.name = req.body.name;
    res.send(course);
})

app.delete('/api/courses/:id', (req, res) => {
    // look up the course, if not existing return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Nema ga');
    
    
    //delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    //return the same course

    res.send(course);
})

function validateCourse(course){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(course);
}

app.get('/api/courses/:id', (req, res) => {
   const course = courses.find(c => c.id === parseInt(req.params.id));
   if(!course) return res.status(404).send('Nema ga');
   res.send(course);
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))