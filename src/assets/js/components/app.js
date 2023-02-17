console.log('12')

const navList = document.querySelectorAll(".nav__list");

/* 
 navList.forEach(item =>{
 item.addEventListener('click', ()=> {
    if(item.textContent === "menu"){
        console.log('')
    }
 })
})  */



  for(let i = 0; i < navList.length; i++){
    navList[i].addEventListener('click', ()=> {
        navList[i].textContent ==="blog"? document.location.href = "http://localhost:3000/blog.html": console.log('no')
    })
}  

for(let i = 0; i < navList.length; i++){
    navList[i].addEventListener('click', ()=> {
        navList[i].textContent ==="home"? document.location.href = "http://localhost:3000": console.log('no')
    })
} 