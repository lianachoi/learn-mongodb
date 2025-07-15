import express from "express";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

const app = express();

// 환경변수 로드해서 사용하게 해주는 패키지
dotenv.config();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

//json 객체 데이터 객체로 변환
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 


//mongoDB연결
const client = new MongoClient(MONGODB_URI);
const connectDB = async ()=>{
    try {
        await client.connect();
        console.log("🚀 MongoDB connected");
    } catch (error) {
        console.log(`⚠ MongoDB Error: ${error}`);
    }
};
const db = client.db(DB_NAME); //db 선택
const collection = db.collection("users"); //collection 선택

//데이터읽기
app.get("/users", async(req, res)=>{
    try {       
        // find return: FindCursor<WithId<Document>>
        // Cursor 객체 : 데이터를 한개씩 순차적으로 가져와 document 반환.
        const users = await collection.find().toArray(); //document 가져오기 - toArray 지정해야 한번에 다 가져옴
        console.log("🚀 ~ app.get ~ users:", users);
        res.status(200).json(users);
    } catch (error) {        
        console.log(`⚠ fetch Error: ${error}`);
        res.status(500).json({
            message: "Error fetching users",
            error: error.message
        });
    }
});

//데이터단건읽기
app.get("/users/:id", async(req, res)=>{
    try {       
        const {id} = req.params;
        const user = await collection.findOne(
            {_id: new ObjectId(id)}, 
            { projection: {name: 1} },//프로젝션 사용 시 projection 이라고 따로 줘야함 
        );
        console.log("🚀 ~ app.get ~ user:", user)
        res.status(200).json(user);
    } catch (error) {        
        console.log(`⚠ fetch Error: ${error}`);
        res.status(500).json({
            message: "Error fetching users",
            error: error.message
        });
    }
});


//데이터쓰기
app.post("/users", async(req, res)=>{
    try {       
        // 구조분해할당(Typeof req.body = object) ES6문법
        // const name = req.body.name; ==> const {name} = req.body.name;
        const {name, age, email} = req.body;
        const result = await collection.insertOne({
            ...req.body,
            createdAt: new Date()
        });
        console.log("🚀 ~ app.get ~ users:", result);
        res.status(201).json(result);
    } catch (error) {        
        console.log(`⚠ insert Error: ${error}`);
        res.status(500).json({
            message: "Error insert user",
            error: error.message
        });
    }
});

// 데이터수정
app.put("/users/:id", async(req, res)=>{
    try {
        const {id} = req.params;
        const data = req.body;

        const result = await collection.updateOne({
            _id: new ObjectId(id)
        }, {$set: {...data,updatedAt: new Date()}});

        if(result.matchedCount == 0) {
            res.status(404).json({
                "message": "There is no matched user."
            })
        }
        res.status(201).json({
                "message": `${result.matchedCount} row(s) has been updated`
            });
    } catch (error) {
        console.log(`⚠ update Error: ${error}`);
        res.status(500).json({
            message: "Error update user",
            error: error.message
        });
    }
});

// 데이터 삭제
app.delete("/users/:id", async(req, res)=>{
    try {
        const {id} = req.params;
        const result = await collection.deleteOne({
            _id: new ObjectId(id)
        });

        if(result.deletedCount){
            res.status(200).json({
                message:`${result.deletedCount} row(s) has been deleted`,
                id
            });
            return;
        }
        res.status(404).json({
            message:"Nobody has been deleted"
        });
        
    } catch (error) {
        res.status(500).json({
            message:"Error delete user",
            error: error.message
        });
    }
});

app.listen(PORT, (req, res)=>{
    console.log("server running at...", PORT);
    console.log(PORT,"포트에서 서버를 시작하는 중입니다.");
    console.log(process.env.MONGODB_URI);
    connectDB();
});