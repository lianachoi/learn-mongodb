//자바스크립트 기초
const dayOfWeeks = ["월욜","화","수","목","금","토","일","cat"];
console.log("🚀 ~ today? ", `${dayOfWeeks[dayOfWeeks.length-1]}요일`)

dayOfWeeks.map((a)=>{
    console.log(`${a}요일`);
})

const b = dayOfWeeks.filter((a)=> a.startsWith('c'))
console.log("🚀 ~ b ~ b :", b )


const words = ["spray", "elite", "exuberant", "destruction", "present"];

const result = words.filter((word) => word.startsWith("e"));
const result2 = words.find((word) => word.startsWith("e"));

console.log("🚀 ~ result:", result)
console.log("🚀 ~ result2:", result2)

const result3 = words.some((word) => word.endsWith("e"));
console.log("🚀 ~ result3:", result3)
const result4 = words.every((word) => word.length > 10);
console.log("🚀 ~ result4:", result4)


const user = {
    isLoggedIn: true,
    role: "admin"
}

const isAccessAdminPage = user.isLoggedIn || user.role === "admin";
console.log("🚀 ~ isAccessAdminPage:", isAccessAdminPage)
if (isAccessAdminPage) {
    console.log("관리자 페이지 접근 가능")
} else {
    console.log("관리자 페이지 접근 불가능")    
}
