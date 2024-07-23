const express = require('express');
const app = express();

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
const url = 'mongodb+srv://admin:qwer1234@cluster0.nwan5aq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
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

// ----------------------------------------------------------

app.get('/', (요청, 응답) => {
    응답.sendFile(__dirname + '/index.html');
})

app.get('/news', (요청, 응답) => {
    응답.send('mongoDB에 데이터 입력할거임');
    // DB에 데이터 입력해보기
    db.collection('post').insertOne({title : '어쩌구'});
})

app.get('/list', async (요청, 응답) => {
    let result = await db.collection('post').find().toArray();
    console.log(result);
    // 0번째 자료의 title을 가져오고 싶다면
    응답.send(result[0].title);
})

app.get('/shop', (req, res) => {
    res.send('쇼핑 페이지임');
})

app.get('/about', (요청, 응답) => {
    응답.sendFile(__dirname + '/intro.html');
})

app.get('/login', (요청, 응답) => {
    if (요청.query.id == 'smhrd' && 요청.query.pw == '1234') {
        console.log('로그인 성공');
    } else {
        console.log('로그인 실패');
    }
    응답.sendFile(__dirname + '/index.html');
})

