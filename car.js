class Car{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05;
        this.angle = 0;

        this.sensor = new Sensor(this);
        this.controls = new Controls(); 
    }

    update(roadBorders){
        this.#move();
        this.sensor.update(roadBorders);
    }

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
        })
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

    draw(ctx){
        ctx.save(); //save the context
        ctx.translate(this.x, this.y); //pt. of rotation
        ctx.rotate(-this.angle); // rotate in a angle

        ctx.beginPath();
        ctx.rect(
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );
        ctx.fill(); 

        ctx.restore();

        this.sensor.draw(ctx);
    }
}