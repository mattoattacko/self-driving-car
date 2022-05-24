class Car {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false; // if the car is damaged, it will be drawn in gray

        this.sensor = new Sensor(this);
        this.controls = new Controls();
    }

    update(roadBorders) {
        if (!this.damaged) { //car cant move if damaged
            this.#move();
            this.polygon = this.#createPolygon(); //car will have a new polygon after moving
            this.damaged = this.#assessDamage(roadBorders); // car will be damaged if it collides with a road border
        }
        this.sensor.update(roadBorders);
    }

    #assessDamage(roadBorders) {
        for (let i = 0; i < roadBorders.length; i++) { //loop through the borders and check if there is an intersection between this.polygon and the border. If so return true. Else return false.
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        return false;
    }

    #createPolygon() {
        const points = []; // array of points, one point per corner of the car
        const rad = Math.hypot(this.width, this.height) / 2; // radius. hypotenuse of the car's width and height
        const alpha = Math.atan2(this.width, this.height); // angle. arc tangent of the car's width and height.

        // top right
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad, // x coordinate of the point. Can change to '*rad*3,' to change the car shape (for any of the 4 corners).
            y: this.y - Math.cos(this.angle - alpha) * rad
        });
        // top left
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        });
        // bottom left
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        });
        // bottom right
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        });
        return points;
    }

    #move() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2;
        }

        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;
            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    draw(ctx) {
        if (this.damaged) {
            ctx.fillStyle = "gray"; // if the car is damaged, it will be drawn in gray
        } else {
            ctx.fillStyle = "black";
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y); // first point in polygon. 
        for (let i = 1; i < this.polygon.length; i++) { //loop through all remaining points
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y); // height polygon's x and y
        }
        ctx.fill();

        this.sensor.draw(ctx);
    }
}