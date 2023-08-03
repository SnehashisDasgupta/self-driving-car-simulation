//stretching the canvas 100% in height and 200px in width
const canvas = document.getElementById("myCanvas");
canvas.width = 200;

// canvas context
const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2, canvas.width * 0.9);// border line on both side of the road
const car = new Car(road.getLaneCenter(1),100,30,50); //Car(x-axis, y-axis, width, height)
car.draw(ctx);

animate();

function animate(){
    car.update(road.borders); //sense the border of the roads

    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height*0.7); //pov: car. Now car will be fixed and road will move.

    road.draw(ctx)
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);//cause the animate method again-and-again many times per second
}