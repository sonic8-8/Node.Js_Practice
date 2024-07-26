const express = require('express');
const app = express();
require('dotenv').config();
const methodOverride = require('method-override');

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(methodOverride('_method'));

// ----------------------------------------------------------

// 여기서 서버를 실행시키지말고 DB 연결 성공하면 실행 ㄱㄱ
// app.listen(8080, () => {
//     console.log('http://www.localhost:8080에서 서버 실행 중');
// })

// ----------------------------------------------------------

// MongoDB 연결 세팅

const { MongoClient, ObjectId } = require('mongodb');

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

app.get('/list', async (요청, 응답) => {
    let result = await db.collection('post').find().toArray();
    // 응답.send(result[0].title);
    응답.render('list.ejs', { 글목록 : result });
})

app.get('/shop', (req, res) => {
    res.send('쇼핑 페이지임');
})

app.get('/about', (요청, 응답) => {
    응답.sendFile(__dirname + '/intro.html');
})

app.get('/time', (요청, 응답) => {
    let time = new Date();
    응답.render('time.ejs', { 시간 : time });
})

app.get('/write', (요청, 응답) => {
    응답.render('write.ejs');
})

app.post('/add', async (요청, 응답) => {
    console.log(요청.body);

    // 서버가 다운되거나 문제가 있을 수 있으니 try-catch 문으로 검증
    try {
        // 검사 로직 ( 내용이 빈칸, 제목이 너무 길 경우, 제목에 특수기호 쓸 경우 )
        if (요청.body.content == '') {
            응답.send('내용 입력 안했음');
        } else if (요청.body.title.length > 20) {
            응답.send('제목이 20글자 초과함');
        } else {
            // DB 저장
            await db.collection('post').insertOne({ title : 요청.body.title, content : 요청.body.content});
            응답.redirect('/list');
        }
    } catch (e) {
        console.log(e);
        응답.status(500).send('DB에러남');
    }
})

// 상세 페이지
app.get('/detail/:id', async (요청, 응답) => {

    try {
    let result = await db.collection('post').findOne({ _id : new ObjectId(요청.params.id) });
    if (result == null) {
        응답.status(400).send('존재하지않는 글입니다');
    }
    // console.log(result);
    응답.render('detail.ejs', { 글 : result });
    } catch (e) {
        응답.send('이상한 값 입력하지 마셈');
    }
})

// 수정 페이지
app.get('/edit/:id', async (요청, 응답) => {
    try {
    let result = await db.collection('post').findOne({ _id : new ObjectId(요청.params.id)});
    if (result == null) {
        응답.status(400).send('존재하지 않는 글입니다');
    }
    응답.render('edit.ejs', { 글 : result });
    } catch (e) {
        응답.send('이상한 값 입력하지 마셈');
    }
})

// mehtod-override를 이용해 put 요청받고 수정하기
app.put('/edit/:id', async (요청, 응답) => {
    // await db.collection('post').updateOne( { _id : new ObjectId(요청.params.id) }, 
    //     { $set : { title : 요청.body.title, content : 요청.body.content } } );

    await db.collection('post').updateOne( { _id : 1 }, { $inc : { like : -2 } } );

    응답.redirect('/list');
})


