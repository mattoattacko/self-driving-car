// 'ctx' = context
class Road {
    constructor(x, width, laneCount = 3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - width / 2;
        this.right = x + width / 2;

        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;

        // the points of reference for our borders
        // if we type 'road.borders' into the browser console, we will get to array objects. The "x:10" is the left border, and the "x:190" is the right border.
        const topLeft = { x: this.left, y: this.top };
        const topRight = { x: this.right, y: this.top };
        const bottomLeft = { x: this.left, y: this.bottom };
        const bottomRight = { x: this.right, y: this.bottom };

        // tells us where the borders are for collision detection
        // first thing in the array is a "segment". Top left and bottom left points form a segment. 
        // something about using arrays because the road is straight and adding curves would be different?
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ];
    }

    // tells us what is the center of a given lane
    // goes L to R starting at zero
    // for different lane indices, an offset of lane width away from the middle of the first lane.
    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount;
        return this.left + laneWidth / 2 + // half the land width. We want to be starting in the middle of the first lane.
            Math.min(laneIndex, this.laneCount - 1) * laneWidth; // we use 'math.min()' to make sure we don't go out of bounds. Will put you in the right most lane.
    }

    // draws the road
    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        for (let i = 1; i <= this.laneCount - 1; i++) {
            // finds the x coordinate of the center of the lane
            const x = lerp( 
                // "lerp" (linear interpolation) is a function that interpolates between two values. It's used here to interpolate between the left and right of the road. Check util.js for more info.
                this.left,
                this.right,
                // we need to get values b/t L/R according to a percentage.
                // "i" is the index of the lane we're on.
                i / this.laneCount
            );
    
            // draws line dashes
            ctx.setLineDash([20, 20]); // lines will have 20px gaps between them with a 20px line length
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([]);
        // goes through borders
        // for each border, beginPath, move to the first point in the border 'x' and 'y', and line to the second point in the border 'x' and 'y'
        this.borders.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        });
    }
}