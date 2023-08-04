//stretching the canvas 100% in height and 200px in width
const canvas = document.getElementById("myCanvas");
canvas.width = 200;

// canvas context
const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2, canvas.width * 0.9);// border line on both side of the road
//owner's car
const car = new Car(road.getLaneCenter(1),100,30,50, "KEYS"); //Car(x-axis, y-axis, width, height) 
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50,"DUMMY", 2)//car in opposite direction resembles traffic
];

animate();

function animate(){
    for(let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders, []);
    }

    car.update(road.borders, traffic); //sense the border of the roads

    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height*0.7); //pov: car. Now car will be fixed and road will move.

    road.draw(ctx)
    for(let i=0; i<traffic.length; i++){
        traffic[i].draw(ctx, "green");//draw the traffic
    }
    car.draw(ctx, "orange");

    ctx.restore();
    requestAnimationFrame(animate);//cause the animate method again-and-again many times per second
}