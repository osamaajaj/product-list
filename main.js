
fetch("data.json")
.then(result => result.json())
.then(function(data){


    // Create Product Card And append it to container (For loop)
    for (let i = 0; i < data.length; i++){
        
        let img = data[i].image.desktop;
        let category = data[i].category;
        let name = data[i].name;
        let price = data[i].price;
        let cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.innerHTML =
            
                `<div class="photo">
                    <img src="${img}" alt="  ">
                </div>
                <div class="add">
                    <div class="default">
                        <i class="fa-solid fa-cart-plus"></i>
                        <span>Add To cart</span>
                    </div>
                    <div class="active hidden">
                        <span class="count-control minus">-</span>
                        <p id="count">1</p>
                        <span class="count-control plus">+</span>
                    </div>
                </div>
                <div class="texts">
                    <p class="category">${category}</p>
                    <h4 class="product-name">${name}</h4>
                    <p class="price">$${price}</p>
                </div>`
            
        const productsCon = document.querySelector(".products");
        productsCon.appendChild(cardElement);  
    }
    

   
    
    

    // add to cart
    const addBtn = document.querySelectorAll(".add");
    addBtn.forEach(btn =>{
        let tempCount = 1;
        let minus = btn.children[1].children[0];
        let plus = btn.children[1].children[2];
        let count = btn.children[1].children[1];
        let addDefault = btn.children[0];
        let addActive = btn.children[1];
        let itemName = btn.nextElementSibling.children[1].textContent;
        let itemPrice = btn.nextElementSibling.children[2].textContent;
        
        
        addDefault.addEventListener("click", ()=>{
            addDefault.classList.add("hidden");
            addActive.classList.remove("hidden");
            let item = {"name":`${itemName}`,"price":`${itemPrice}`, "count": `${count.innerHTML}`}
            let cartItem = document.createElement("li");
            cartItem.innerHTML = 
                        `<div class="sel-info">
                            <h4 class="sel-name">${item.name}</h4>
                            <div class="sel-detailes">
                                <span class="sel-count">x${item.count}</span>
                                <span class="sel-price">@${item.price.replace("$", "")}</span>
                                <span class="sel-total">${item.price}</span>
                            </div>
                        </div>
                        <div class="delete">
                            <img src="./assets/images/icon-remove-item.svg" alt="">
                        </div>`
                    
            let selList = document.querySelector(".sel-list");
            
            let delBtn = cartItem.querySelector(".delete");
            delBtn.addEventListener("click", (e)=>{
                e.target.parentElement.remove();
                let targetItemName = e.target.previousElementSibling.children[0].textContent;
                let cards = document.querySelectorAll(".card");
                cards.forEach(card=>{
                    if(card.children[2].children[1].textContent == targetItemName){
                        card.children[1].children[0].classList.remove("hidden");
                        card.children[1].children[1].classList.add("hidden");
                        card.children[1].children[1].children[1].textContent = 1;
                        tempCount = 1;
                        
                    }
                })
                let cartCount = document.getElementById("selListCount");
                cartCount.textContent = `(${document.querySelector(".sel-list").childElementCount})`;
            })  
        
            
            selList.appendChild(cartItem);
            let cartCount = document.getElementById("selListCount");
            cartCount.textContent = `(${document.querySelector(".sel-list").childElementCount})`;
            document.getElementById("total").textContent = `$${greatTotal()}`;
        })

        // PLUS 
        plus.addEventListener("click", (e)=>{
            tempCount++;
            count.textContent = tempCount;
            /*--------*/
            let selCount = document.querySelectorAll(".sel-count");
            selCount.forEach(cou =>{
                if(cou.parentElement.previousElementSibling.textContent == itemName){
                    cou.innerHTML = `x${tempCount}`;
                    cou.nextElementSibling.nextElementSibling.textContent = `$${tempCount * (Number(cou.nextElementSibling.textContent.replace("@", "")))}`
                }

            })
            document.getElementById("total").textContent = `$${greatTotal()}`;

        });
        // MINUS
        minus.addEventListener("click", ()=>{
            if(tempCount == 1){
                addActive.classList.add("hidden");
                addDefault.classList.remove("hidden");
                let selCount = document.querySelectorAll(".sel-count");
                selCount.forEach(cou =>{
                    if(cou.parentElement.previousElementSibling.textContent == itemName){
                        cou.parentElement.parentElement.parentElement.remove();

                    }

                })
                
            }
            else{
                tempCount--;
                count.textContent = tempCount;
                let selCount = document.querySelectorAll(".sel-count");
                selCount.forEach(cou =>{
                    if(cou.parentElement.previousElementSibling.textContent == itemName){
                        cou.innerHTML = `x${tempCount}`
                        cou.nextElementSibling.nextElementSibling.textContent = `$${tempCount * (Number(cou.nextElementSibling.textContent.replace("@", "")))}`

                    }

                })
            }

            let cartCount = document.getElementById("selListCount");
            cartCount.textContent = `(${document.querySelector(".sel-list").childElementCount})`;
            document.getElementById("total").textContent = `$${greatTotal()}`;
        });

        
    })

    function greatTotal(){
        let gTemp = 0;
        let selTotals = document.querySelectorAll(".sel-total");
        selTotals.forEach(t => {
            totalNum = Number(t.textContent.replace("$", ""));
            gTemp += totalNum;
        })
        return gTemp;
    }
    
    // Check if cart empty and show empty cart image 
    setInterval(()=>{
        const selItemsCount = document.querySelector(".sel-list").childElementCount;
        const emptyCart = document.querySelector(".empty-cart");
        const fullCart = document.querySelector(".full-cart");
        if(selItemsCount == 0){
            fullCart.classList.add("hidden");
            emptyCart.classList.remove("hidden");
        }
        else{
            emptyCart.classList.add("hidden");
            fullCart.classList.remove("hidden");
        }
        
        
    
    }, 0)
    
    
    

    // confirm order
    const confirmBtn = document.getElementById("confirmBtn");
    confirmBtn.addEventListener("click", ()=>{
        let selItems = document.querySelector(".sel-list").querySelectorAll("li");

        function imageFind(itm){
            let cards = document.querySelectorAll(".card");
            let imgUrl = "";
            cards.forEach(ca=>{
                if(ca.children[2].children[1].textContent == itm.children[0].children[0].textContent){
                    
                    imgUrl = `${ca.children[0].children[0].src.replace("desktop", "thumbnail")}`;
                    
                }
                
            })
            return imgUrl;
        }

        let tempData = [];
        selItems.forEach(itm =>{
            let itemData = { 
                            "name": "",
                            "count": "",
                            "price": "",
                            "total": "",
                            "img":""
                        };
            itemData.name = itm.children[0].children[0].textContent;
            itemData.count = itm.children[0].children[1].children[0].textContent;
            itemData.price = itm.children[0].children[1].children[1].textContent;
            itemData.total = itm.children[0].children[1].children[2].textContent;
            itemData.img =  `${imageFind(itm)}`;
            tempData.push(itemData);
        })
        
        for(let i = 0; i < tempData.length; i++){
            let comList = document.querySelector(".list-com"); 
            let comItem = document.createElement("li");
            comItem.classList.add("item-com");
            comItem.innerHTML = `<div class="thumb">
                                <img src="${tempData[i].img}" alt="">
                            </div>
                            <div class="item-com-info">
                                
                                <h4 class="item-com-name">${tempData[i].name}</h4>
                                <div>
                                    <span class="com-count">${tempData[i].count}</span>
                                    <span class="com-price">${tempData[i].price}</span>
                                </div>
                                
                            </div>
                            <div class="total-price">
                                ${tempData[i].total}
                            </div>`
            comList.appendChild(comItem);   
        }
        document.getElementById("com-total").textContent = document.getElementById("total").textContent;
        document.querySelector(".com").style.display = "block";
        document.getElementById("effect").style.display = "block";

        
    })



    const startNewBtn = document.getElementById("startNewOrder");
    startNewBtn.addEventListener("click", ()=>{

        document.querySelector(".com").style.display = "none";
        document.getElementById("effect").style.display = "none";
        location.reload();

    })    
    
    
    
})






