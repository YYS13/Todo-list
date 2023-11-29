let section = document.querySelector("section");
let add = document.querySelector("form button");
add.addEventListener("click",e =>{
    //防止送出表單
    e.preventDefault();
    //找出input的value
    let text = add.parentElement.children[0].value;
    let year = add.parentElement.children[1].value;
    let month = add.parentElement.children[2].value;
    let date = add.parentElement.children[3].value;
    if(text===""){
        alert("請輸入待辦事項"); //避免使用者未輸入內容
        return;
    }
    if((year==="") || (month==="") || (date==="")){
      alert("請輸入時間"); //避免使用者未輸入內容
      return;
    }
    if((Number(month)<=0) || (Number(month)>12) ){
      alert("請輸入1~12月"); //只能輸入1~12月
      return;
    }
    if((Number(date)<=0) || (Number(date)>31) ){
      alert("請輸入1~31的日期"); //只能輸入1~31號
      return;
    }
    //在下方新增清單
    let todo = document.createElement("div");
    todo.classList.add("todo");
    let todo_text = document.createElement("p");
    todo_text.classList.add("todo-text");
    todo_text.innerText = text;
    let todo_time = document.createElement("p");
    todo_time.classList.add("todo-time");
    todo_time.innerText = year+"/"+ month +"/"+date;
    todo.appendChild(todo_text)
    todo.appendChild(todo_time)
    //新增完成、移除標籤
    let complete = document.createElement("button")
    complete.classList.add("complete-button")
    complete.innerHTML = '<i class="fas fa-check-circle"></i>'
    complete.addEventListener("click", e=>{
        let todoItem = e.target.parentElement
        todoItem.classList.toggle("done")
    })

    let trash = document.createElement("button")
    trash.classList.add("trash-button")
    trash.innerHTML = '<i class="fas fa-trash"></i>'
    trash.addEventListener("click",e=>{
        let trashItem = e.target.parentElement
        trashItem.addEventListener("animationend",e=>
        {
            //remove from localstorage
            let text = trashItem.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            myListArray.forEach((item,index)=>{
                if(item.text == text){
                    myListArray.splice(index,1);
                    localStorage.setItem("list",JSON.stringify(myListArray));
                }
            })
            trashItem.remove()
        })

        trashItem.style.animation = "scaleDown 0.3s forwards"
    })
    todo.appendChild(complete)
    todo.appendChild(trash)
    todo.style.animation = "scaleUp 0.3s forwards"

    //create an object
    let myTodo={
        text:text,
        year:year,
        month:month,
        date:date
    };

    //store data into an array of objects
    let mylist =localStorage.getItem("list")
    if (mylist == null){
        localStorage.setItem("list",JSON.stringify([myTodo]));
    }else{
        let myListArray= JSON.parse(mylist);
        myListArray.push(myTodo);
        localStorage.setItem("list",JSON.stringify(myListArray));
    }

    console.log(JSON.parse(localStorage.getItem("list")));

    add.parentElement.children[0].value = ""; //當輸入完一待辦事項時，清除原輸入內容
    section.appendChild(todo)
})

loadData();

function loadData(){
    let myList = localStorage.getItem("list")
    if(myList !== null){
        let myListArray =JSON.parse(myList)
        myListArray.forEach(item => {

            //create a todo
            let todo = document.createElement("div");
            todo.classList.add("todo");
            let todo_text = document.createElement("p");
            todo_text.classList.add("todo-text");
            todo_text.innerText = item.text;
            let todo_time = document.createElement("p");
            todo_time.classList.add("todo-time");
            todo_time.innerText = item.year+"/"+item.month +"/"+item.date;
            todo.appendChild(todo_text);
            todo.appendChild(todo_time);

            //新增完成、移除標籤
            let complete = document.createElement("button")
            complete.classList.add("complete-button")
            complete.innerHTML = '<i class="fas fa-check-circle"></i>'
            
            complete.addEventListener("click", e=>{
                let todoItem = e.target.parentElement
                todoItem.classList.toggle("done")
            })

            let trash = document.createElement("button");
            trash.classList.add("trash-button");
            trash.innerHTML = '<i class="fas fa-trash"></i>';

            trash.addEventListener("click",e=>{
                let trashItem = e.target.parentElement;

                trashItem.addEventListener("animationend",e=>{
                    
                    //remove from localstorage
                    let text = trashItem.children[0].innerText;
                    let myListArray = JSON.parse(localStorage.getItem("list"));
                    myListArray.forEach((item,index)=>{
                        if(item.text == text){
                            myListArray.splice(index,1);
                            localStorage.setItem("list",JSON.stringify(myListArray));
                        }
                    })

                    trashItem.remove();
                })

                trashItem.style.animation = "scaleDown 0.3s forwards";
            })

            todo.appendChild(complete);
            todo.appendChild(trash);

            section.appendChild(todo)
        })
    }
}
            
function mergeTime(arr1,arr2){
  let result = [];
  let i = 0 ;
  let j = 0 ;

  while (i < arr1.length && j < arr2.length){
    if(Number(arr1[i].year) > Number(arr2[j].year)){
      result.push(arr2[j]);
      j++;
    }else if (Number(arr1[i].year) < Number(arr2[j].year)){
      result.push(arr1[i]);
      i++;
    }else if (Number(arr1[i].year) == Number(arr2[j].year)){
      if(Number(arr1[i].month) > Number(arr2[j].month)){
        result.push(arr2[j]);
        j++;
      }else if (Number(arr1[i].month) < Number(arr2[j].month)){
        result.push(arr1[i]);
        i++;
      }else if (Number(arr1[i].month) == Number(arr2[j].month)){
        if(Number(arr1[i].date) > Number(arr2[j].date)){
          result.push(arr2[j]);
          j++;
        }else{
          result.push(arr1[i]);
          i++;
        }
      }
    }
  }

  while(i < arr1.length){
    result.push(arr1[i]);
    i++;
  }
  while(j < arr2.length){
    result.push(arr2[j]);
    j++;
  }

  return result;

}

function mergeSort(arr){
  if(arr.length === 1){
    return arr;
  }else{
    let middle = Math.floor(arr.length/2);
    let right = arr.slice(0,middle);
    let left = arr.slice(middle,arr.length);
    return mergeTime(mergeSort(right),mergeSort(left));
  }
}

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click",()=>{
  //sort data
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list",JSON.stringify(sortedArray));

  //remove data
  let len = section.children.length;
  for (let i = 0;i < len; i++){
    section.children[0].remove();
  }

  //load data
  loadData();
})