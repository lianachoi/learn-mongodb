import express from "express";

const app = express();

app.listen(8080, (req, res)=>{
    console.log("server running at...");
    console.log("서버를 시작하는 중입니다.");
});