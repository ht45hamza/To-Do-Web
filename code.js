let v=document.querySelector("#input");
let a=document.querySelector("#add");
let d=document.querySelector("#del");
let u=document.getElementById("updt");
let s=document.getElementById("show");
let arr=[];

a.addEventListener("click",function(){
    if(v.value.trim()!==""){
    arr.push(v.value);
    alert("Task Added successfully!!");
    }else{
        alert("Enter any Task");
    }
})

d.addEventListener("click",function(){
    if(v.value.trim()!==""){
        let index=arr.indexOf(v.value.trim());
            arr.splice(index,1);
            alert("Task Deleted");
    }else{
        alert("No task found");
    }
})

u.addEventListener("click",function(){
    let n=prompt("Enter the task you want to update!");
    if(v.value.trim()==n){
        let nn=prompt("enter the new task");
        let index=arr.indexOf(v.value.trim());
            arr.splice(index,1,nn);
            alert("Task Updated");
    }else{
        alert("No task found");
    }
})


let l=document.querySelector(".list");
s.addEventListener("click", function () {
    l.innerHTML="";
    if(arr.length>0){
        arr.forEach(task=>{
            let item=document.createElement("li");
            item.innerText=task;
            l.appendChild(item);
        });
    }else{
        alert("No task to show");
    }
});
