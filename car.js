class Car{
    constructor(x, y, width, height, controlType, maxSpeed=4){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;

        this.useBrain = controlType == "AI";

        // dummy cars will not have any sensors
        if (controlType != "DUMMY"){
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount, 6, 4]
            );
        }
        this.controls = new Controls(controlType); 
    }

    update(roadBorders, traffic){
        //if car is damaged by colliding with the borders of road then it will stop moving
        if(!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }

        if (this.sensor){
            this.sensor.update(roadBorders, traffic);
            // if obstacles are far away from car ,then return 0, if they are too close to the car, then return value
            const offsets = this.sensor.readings.map(
                s=> s==null?0:1-s.offset
            );
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);
            // console.log(outputs);

            // car will run automitacally
            if(this.useBrain){
                this.controls.forward = outputs[0];
                this.controls.reverse = outputs[1];
                this.controls.left = outputs[2];
                this.controls.right = outputs[3];
            }
        }
    }

    #assessDamage(roadBorders, traffic){
        for(let i=0; i<roadBorders.length; i++){
            // if there is any intersection b/w the car and the roadBorders then return true
            if(polyIntersect(this.polygon, roadBorders[i])){
                return true;
            }
        }

        for(let i=0; i<traffic.length; i++){
            // it will now detect dummy car as obstacle
            if(polyIntersect(this.polygon, traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }

    // it create the shape of the car [here it is rectangle shaped]
    #createPolygon(){
        const points = []; //array of points to store points of all the corners  of the car.
        //shape of car = rectangle. 
        // radius = half the diagonal/hypotenuse of the rectangle.
        // radius = {(width)^2 + (height)^2 }^1/2 (Pythagorean theorem). same thing is done below 
        const rad = Math.hypot(this.width, this.height)/2; // .hypot -> hypotenuse
        // tanθ = opposite side / adjacent side. [opposite side= width, adjacent side= height]. Same thing is done below
        const alpha = Math.atan2(this.width, this.height);

        // co-ordinates(x-y values) of the the 4 corners of the car
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        });

        return points;
    }
 
    #move(){
        //moves the car upwards
        if (this.controls.forward){
            //speed increases on long press of up arrow
            this.speed += this.acceleration;
        }
        
        if(this.controls.reverse){
            //decrease the speed when pressed down arrow
            this.speed -= this.acceleration;
        }

        //doesn't increase the speed beyond max-speed limit.
        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        // reverse max-speed is half the fowraed max-speed
        if (this.speed < -this.maxSpeed/2){
            this.speed = -this.maxSpeed/2;
        }

        if(this.speed > 0){
            this.speed -= this.friction;//car speed decreases with the friction if speed is not zero
        }
        if(this.speed < 0){
            this.speed += this.friction;//car speed increases with the friction if speed is less than zero
        }

        //if speed is less than friction then it will stop. 
        if(Math.abs(this.speed) < this.friction){
            this.speed = 0;
        }

        // if cars move backwards, then after pressing left key, the car will move in right position while moving in reverse motion and vice-versa
        if(this.speed != 0){
            //if speed is +ve then flip=1 and if speed is -ve then flip=-1
            const flip = this.speed > 0 ?1 : -1; 
            if(this.controls.left){
                this.angle += 0.03 * flip;
            }
            if(this.controls.right){
                this.angle -= 0.03 * flip;
            }
        }
        
        // car moves forward and backwards as per the angle of rotation
        this.x -= Math.sin(this.angle)*this.speed;
        this.y -= Math.cos(this.angle)*this.speed;  
    }

    // draw the car with all the co-ordinates of car
    draw(ctx, color, drawSensor=false){
        if (!this.polygon || this.polygon.length === 0) {
            return; // Return early if the polygon is not defined or has no points
        }

        if(this.damaged){
            ctx.fillStyle = "gray";
        }else{
            ctx.fillStyle = color;
        }

        ctx.beginPath();

        // co-ordinates of the 1st point
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i=1; i<this.polygon.length; i++){
            // co-ordinates of the rest 3 points
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();

        if (this.sensor && drawSensor){
            this.sensor.draw(ctx);
        }
    }
}