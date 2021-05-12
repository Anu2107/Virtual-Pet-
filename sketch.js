var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var feed, lastFed; 



function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feedDogD=createButton("Feed the Dog"); 
  feedDogD.position(600, 95); 
  feedDogD.mousePressed(feedDog); 
 

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime = database.ref('FeedTime'); 
  fedTime.on("value", function(data){
  lastFed = data.val(); 
  })

  textSize(18); 

  if (lastFed>= 12){
    text("Last Feed: " + lastFed%12 + "p.m.", 350, 30); 
  }
  else if(lastFed === 0){
    text("Last Feed: 12 a.m.", 350, 30); 
  }
  else if(lastFed< 12){
    text("Last Feed: " + lastFed + "a.m.", 350, 30); 
  }


 
  drawSprites();
}


function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}



function feedDog(){
  dog.addImage(happyDog);
  console.log("Hello"); 

  var foodStockVal = foodObj.getFoodStock(); 
  if(foodStockVal<= 0){
    foodObj.updateFoodStock(0); 
  }
  else{
    foodObj.updateFoodStock(foodObj.deductFood()); 
  }
  foodS = foodS--; 
  database.ref('/').update({
    'FeedTime': hour(), 
    'Food': foodS
    
  })
  
  foodObj.display(); 
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
