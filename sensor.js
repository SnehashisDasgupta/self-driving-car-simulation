class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI/2;

        this.rays = [];  
        this.readings = [];
    }

    update(roadBorders, traffic){
        this.#castRays();
        this.readings = [];

        for(let i=0; i<this.rays.length; i++){
            this.readings.push(
                this.#getReadings(this.rays[i], roadBorders, traffic)
            );
        } 
    }

    #getReadings(ray, roadBorders, traffic){
        let touches = [];//count no. of touches to avoid collision

        for(let i=0; i<roadBorders.length; i++){
            // getIntersection return {x, y, offsets}
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            );
            if (touch){
                touches.push(touch); //if any touch happed, add to the touches array
            }
        }

        // rays will turn black if it touches the dummy car which will act as a sensor
        for (let i=0; i<traffic.length; i++){
            const poly = traffic[i].polygon;
            for(let j=0; j<poly.length; j++){
                const value = getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j+1) % poly.length]
                );
                // checks if it touches the dummy car or not
                if(value){
                    touches.push(value);
                }
            }
        }

        // if zero touches then no collision
        if (touches.length == 0){
            return null;
        }else{
            // get all the elements from 'touches' array and from each element it takes all the offset and store in 'offsets'
            const offsets = touches.map(e => e.offset);
            const minOffset = Math.min(...offsets);//Math.min doesn't work with array, so (...) is used to spread the array in elements to work with
            return touches.find(e => e.offset == minOffset); //return the touch that have min. offset. [to find the nearest object from the car]
        }
    }

    #castRays(){
        this.rays = [];
        for(let i=0; i<this.rayCount; i++){
            const rayAngle = lerp(
                this.raySpread/2, 
                -this.raySpread/2, 
                this.rayCount==1? 0.5 : i/(this.rayCount-1)
            ) + this.car.angle;

            const start = {x: this.car.x, y:this.car.y};
            const end ={
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength
            };
            this.rays.push([start, end]);
        }
    }

    draw(ctx){
        for(let i=0; i<this.rayCount; i++){
            if (this.rays[i] && this.rays[i].length >= 2) { // Check if the ray exists and contains at least 2 points

                let end = this.rays[i][1];
                if (this.readings[i]){
                    end = this.readings[i];// pass x & y from getIntersection to the 'end'
                }

                // return 'yellow' color if no collision
                ctx.beginPath();
                ctx.lineWidth = 2; // width=2px
                ctx.strokeStyle = "yellow"; // colour of rays
                ctx.moveTo(
                    this.rays[i][0].x,
                    this.rays[i][0].y
                );
                ctx.lineTo(
                    end.x,
                    end.y
                );
                ctx.stroke();

                //return 'black' color in the part of ray where collision happens
                ctx.beginPath();
                ctx.lineWidth = 2; // width=2px
                ctx.strokeStyle = "black"; // colour of rays
                ctx.moveTo(
                    this.rays[i][1].x,
                    this.rays[i][1].y
                );
                ctx.lineTo(
                    end.x,
                    end.y
                );
                ctx.stroke();
            }
        }
    }
}