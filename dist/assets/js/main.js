console.log('1')

const navList = document.querySelectorAll(".nav__list");

/* 
 navList.forEach(item =>{
 item.addEventListener('click', ()=> {
    if(item.textContent === "menu"){
        console.log('eee')
    }
 })
})  */

/* navList.forEach(item =>{
    item.addEventListener('click', (event)=> {
   event.target ==="menu"? console.log('eee'): console.log('no')
    })
   }) */

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
console.log('2')
console.log('3')
