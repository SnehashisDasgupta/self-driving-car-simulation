class Road{
    constructor(x, width, laneCount=3 ){
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - width/2;//left width of road
        this.right = x + width/2;//right width of road

        const infinity = 1000000;
        this.top = -infinity;//car can move forward upto almost infinity
        this.bottom = infinity;//car can move backwards upto infinity

        //detect the borders of the lane[to do collision detection]
        const topLeft = {x: this.left, y: this.top};
        const bottomLeft = {x: this.left, y: this.bottom};
        const topRight = {x: this.right, y: this.top};
        const bottomRight = {x: this.right, y: this.bottom};
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ];
    }

    //differentiate the lanes with index no.s , starting from 0 to n [n=laneCount];
    getLaneCenter(laneIndex){
        const laneWidth = this.width/this.laneCount;
        return this.left + laneWidth/2 + Math.min(laneIndex, this.laneCount-1)*laneWidth;
    }

    draw(ctx){
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        //divides the road into no. of lanes[by default: laneCount=3]
        for(let i=1; i<=this.laneCount-1; i++){
            const x = lerp(this.left, this.right, i/this.laneCount);

            ctx.setLineDash([20,20]);//[20,20]: 20px of height of the dashes & 20px of gap b/w them

            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([]); 
        this.borders.forEach(border=> {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        });
    }
}