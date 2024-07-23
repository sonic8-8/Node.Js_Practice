const express = require('express');
const app = express();
require('dotenv').config();


app.use(express.static(__dirname + '/public'));

// ----------------------------------------------------------

// 여기서 서버를 실행시키지말고 DB 연결 성공하면 실행 ㄱㄱ
// app.listen(8080, () => {
//     console.log('http://www.localhost:8080에서 서버 실행 중');
// })

// ----------------------------------------------------------

// MongoDB 연결 세팅

const { MongoClient } = require('mongodb');

let db;
const url = process.env.MONGODB_URL;
new MongoClient(url).connect().then((client) => {
    console.log('DB연결성공');
    db = client.db('forum');

    // 서버 실행

    app.listen(8080, () => {
        console.log('http://www.localhost:8080에서 서버 실행 중');
    })


}).catch((err) => {
    console.log(err)
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
