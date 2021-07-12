const { Tasks } = require('../db');
const { v4: uuidv4 } = require('uuid');
const LATENCY = 500;

module.exports = app => {

    app.get('/api/tasks', (req, res) => {
        setTimeout(async () => {
            try {
                const data = await Tasks.findAll();
                res.json(data);
            }
            catch(e){
                res.status(500).send({ error: e });
            }
        }, LATENCY);
    });

    app.get('/api/tasks/:id', async (req, res) => {
        setTimeout(async () => {
            try {
                const result = await Tasks.findById(req.params.id);
                res.json(result);
            }
            catch(e){
                res.status(500).send({ error: e });
            }
        }, LATENCY);
    });

    app.post('/api/tasks', async (req, res) => {
        const id = uuidv4();
        setTimeout(async () => {
            try {
                await Tasks.create({
                    ...req.body,
                    id,
                    isDone: 'false',
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                const result = await Tasks.findById(id);
                res.json(result);
            }
            catch(e){
                res.status(500).send({ error: e });
            }
        }, LATENCY);
    });

    app.patch('/api/tasks/:id', async (req, res) => {
        setTimeout(async () => {
            try {
                await Tasks.update(req.body, { where: { id: req.params.id }});
                const data = await Tasks.findById(req.params.id);
                res.json(data);
            }
            catch(e){
                res.status(500).send({ error: e });
            }
        });
    });

    app.delete('/api/tasks/:id', async (req, res) => {
        setTimeout(async () => {
            try {
                await Tasks.destroy({ where: { id: req.params.id }});
                res.json(true);
            }
            catch(e){
                res.status(500).send({ error: e });
            }
        });
    });
};