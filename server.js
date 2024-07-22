const express = require('express');
const app = express();

app.listen(8080, () => {
    console.log('http://www.localhost:8080에서 서버 실행 중')
})

app.get('/', (요청, 응답) => {
    응답.sendFile(__dirname + '/index.html');
})

app.get('/news', (요청, 응답) => {
    응답.send('오늘 비옴');
})

app.get('/shop', (req, res) => {
    res.send('쇼핑 페이지임');
})

app.get('/about', (요청, 응답) => {
    응답.sendFile(__dirname + '/intro.html');
})
