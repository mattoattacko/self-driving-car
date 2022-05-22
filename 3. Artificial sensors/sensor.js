class Sensor {
    constructor(car) { //the constructor takes the 'car' as an argument because we want the sensor to know where the car is. We use the 'car' properties to update it.
        this.car = car;
        this.rayCount = 5; //number of rays. We can't set it to '1' because 'this.rayCount - 1' in '#castRays()' will always be equal to '0'. We fix it by setting it to 'this.rayCount = 1?0.5'
        this.rayLength = 150; //the length of the ray in pixels.
        this.raySpread = Math.PI / 2; //the angle of the ray in radians. 'Math.PI / 2' is 90 degrees. 'Math.PI / 4' is 45 degrees. 'Math.PI*2' is 360 degrees.

        this.rays = []; //contains the individual rays
        this.readings = []; //'readings' is some value for each array telling us if theres a border there, and how far is it.
    }

    update(roadBorders) { //the update method receives 'roadBorders' as an argument. Now we can use them to detect if the road boarders are close or not. 
        this.#castRays();
        this.readings = []; //initialize readings array
        for (let i = 0; i < this.rays.length; i++) { //iterate through all of the rays
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders)
            );
        }
    }

    // need to check where the array touches the road borders.
    // if it touches ('touches' being where the ray touches something), we need to know how far away it is, and keep the closest one. That will be our reading.
    #getReading(ray, roadBorders) {
        let touches = [];

        for (let i = 0; i < roadBorders.length; i++) { // goes through borders one by one.
            const touch = getIntersection(
                ray[0], //ray start. Basically center of the car.
                ray[1], //ray[1] is the end of the ray. ray 0 and 1 together form a segment.
                roadBorders[i][0],
                roadBorders[i][1]
            );
            if (touch) {
                touches.push(touch); //if there is a touch, we push it inside the 'touches' array. 
            }
        }

        if (touches.length == 0) {
            return null; //if there are no touches, we return null.
        } else {
            const offsets = touches.map(e => e.offset); //Goes through the array and takes each elements offset. We map the 'offset' property of each touch to a new array. 'offset' is how far (distance) the point is from the ray[0] point.
            const minOffset = Math.min(...offsets); //we want the nearest touch, because that's all we really care about. We spread all the offset array to individual values.
            return touches.find(e => e.offset == minOffset); //finds the touch with the smallest offset and returns it.
            //'e =>' means it goes through element by element.
        }
    }

    #castRays() {
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp( //lerp is a function that takes two values and returns a value between them. See 'utils.js'.
                this.raySpread / 2, //unit circle
                -this.raySpread / 2,
                this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1) //This is the 't' value. 'i' will never become equal to 'rayCount'. So the maximum value for 'i' is 'this.rayCount - 1'.
                // reads: if this ray count is '1', we just return half. So the ray will be strait up. 
            ) + this.car.angle; //adding this will make the sensor rays follow the front of the car as it turns. Without this, the rays will constantly point forwards.

            const start = { x: this.car.x, y: this.car.y };
            const end = {
                x: this.car.x -
                    Math.sin(rayAngle) * this.rayLength,
                y: this.car.y -
                    Math.cos(rayAngle) * this.rayLength
            };

            //now that we have a start and end point, we push them inside the 'rays' array to form a 'segment'.
            //we did similar in 'road.js' when we created the 'this.borders' array.
            this.rays.push([start, end]);
        }
    }

    // 'ctx' is the context
    draw(ctx) {
        for (let i = 0; i < this.rayCount; i++) { // we go through all of the rays (arrays?)
            let end = this.rays[i][1]; //the arrays endpoint
            if (this.readings[i]) { //if there is a reading, we set 'end' to the value of that reading.
                end = this.readings[i];
                // the readings comes from the getIntersection function. We get the 'x', 'y', and the 'offset'. We basically pass the 'x' & 'y' attributes to the 'end' variable.
            }

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo( // move to the start location
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo( //rays end location
                end.x,
                end.y
            );
            ctx.stroke();

            //visualizes the ray length even when it touches something.
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(
                this.rays[i][1].x, //draws to where the end of the ray could be.
                this.rays[i][1].y
            );
            ctx.lineTo(
                end.x, //draws to where the end of the ray is (if its a reading or not)
                end.y
            );
            ctx.stroke();
        }
    }
}