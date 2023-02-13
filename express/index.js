const app = require('express')()

app.get('/api/ping', (req, res) => res.send('pong'))

app.listen(3001, () => console.log('Express on 3001'))