//stretching the canvas 100% in height and 200px in width
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

// canvas context
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width * 0.9);// border line on both side of the road
//owner's car
const car = new Car(road.getLaneCenter(1),100,30,50, "AI"); //Car(x-axis, y-axis, width, height) 
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50,"DUMMY", 2)//car in opposite direction resembles traffic
];

animate();

function animate(time){
    for(let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders, []);
    }

    car.update(road.borders, traffic); //sense the border of the roads

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -car.y + carCanvas.height*0.7); //pov: car. Now car will be fixed and road will move.

    road.draw(carCtx)
    for(let i=0; i<traffic.length; i++){
        traffic[i].draw(carCtx, "green");//draw the traffic
    }
    car.draw(carCtx, "orange");

    carCtx.restore();

     networkCtx.lineDashOffset = -time/50;
    Visualizer.drawNetwork(networkCtx,car.brain);
    requestAnimationFrame(animate);//cause the animate method again-and-again many times per second
}