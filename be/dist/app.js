import express from 'express';
const app = express();
const port = 3000;
app.get('/category', (req, res) => {
    res.send('Hello World!');
});
app.post('/category', (req, res) => {
    res.send('ahoj!');
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=app.js.map