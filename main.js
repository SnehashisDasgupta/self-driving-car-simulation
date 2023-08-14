//stretching the canvas 100% in height and 200px in width
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

// canvas context
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width * 0.9);// border line on both side of the road

//traffic
const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
    //used to parse the JSON string retrieved from local storage and convert it back into a JavaScript object
    bestCar.brain = JSON.parse(
        localStorage.getItem("bestBrain")
    );
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50,"DUMMY", 2),//car in opposite direction resembles traffic
    new Car(road.getLaneCenter(0), -300, 30, 50,"DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50,"DUMMY", 2),
];

animate();

function save(){
    // method is used to store data in the browser's local storage
    localStorage.setItem("bestBrain",
    // converts the 'bestCar.brain' object into a JSON string so that it can be stored in local storage
    JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

// generate cars representing traffic
function generateCars(N){
    const cars = [];
    for(let i=1; i<=N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));//Car(x-axis, y-axis, width, height) 
    }
    return cars;
}

function animate(time){
    for(let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders, []);
    }

    for(let i=0; i<cars.length; i++){
        cars[i].update(road.borders, traffic); //sense the border of the roads
    }

    // finds the car which is moving forward [whose y-value is increasing]
    const bestCar = cars.find(
        c=> c.y == Math.min(...cars.map(c => c.y))
    );

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height*0.7); //pov: car. Now car will be fixed and road will move.

    road.draw(carCtx)
    for(let i=0; i<traffic.length; i++){
        traffic[i].draw(carCtx, "green");//draw the traffic
    }

    carCtx.globalAlpha=0.2;//opacity of cars
    for(let i=0; i<cars.length; i++){
        cars[i].draw(carCtx, "orange");
    }
    
    carCtx.globalAlpha=1;//opacity of user car
    bestCar.draw(carCtx, "orange", true);

    carCtx.restore();

     networkCtx.lineDashOffset = -time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);//cause the animate method again-and-again many times per second
}