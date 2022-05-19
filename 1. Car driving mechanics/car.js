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
        this.angle = 0; // w/o this our car can go faster than max speed if going diagonal 

        this.controls = new Controls();
    }

    update() {
        this.#move();
    }

    #move() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        // Caps our speed at maxSpeed
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }

        // the '-' negative sign is to indicate that we are moving backwards.
        if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2;
        }

        // speed decreases by friction
        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        // speed increases by friction
        if (this.speed < 0) {
            this.speed += this.friction;
        }

        // if the speed has and absolute value that is less than the friction, have it become 0.
        // this is done to keep the car from drifting/wandering off by itself.
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        // Left and Right controls
        // this angle works according to the "unit circle", except in our case the value of 0 is in the 'up' direction (instead of 'right' on the X axis)
        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1; // flips the controls backwards if the car is moving backwards
            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }

        // this allows us to move the car in the direction of the angle. w/o this, the car would rotate but still only drive in the up/down directions, not following the direction is which it is facing.
        this.x -= Math.sin(this.angle) * this.speed; // unit circle has a radius of 1. "Sin" has a range of -1 to 1.
        this.y -= Math.cos(this.angle) * this.speed;
    }

    // Draws the car
    // 'ctx' is the context
    // 'x' and 'y' are the coordinates of the car
    draw(ctx) {
        ctx.save(); // saves the current state of the canvas
        ctx.translate(this.x, this.y); // translates to the point where we want the rotation to be centered at
        ctx.rotate(-this.angle); // rotates the car according to the angle

        ctx.beginPath();
        ctx.rect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
        ctx.fill();

        ctx.restore(); // we make the call to context to restore the state of the canvas to what it was before we started drawing. w/o this, the car would look janky when rotating.
    }
}