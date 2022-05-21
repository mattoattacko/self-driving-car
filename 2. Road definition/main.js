const canvas=document.getElementById("myCanvas");
canvas.width=200;

const ctx = canvas.getContext("2d");
const road=new Road(canvas.width/2,canvas.width*0.9); // our road is half the width of the canvas. Adding the width*0.9 will make the white lines have a bit more space on the margins of the road.
const car=new Car(road.getLaneCenter(1),100,30,50); // getLaneCenter(3) would be the right most lane.

animate();

function animate(){
    car.update();

    canvas.height=window.innerHeight;


    // this gives us the 'camera over the car' effect
    ctx.save();
    ctx.translate(0,-car.y+canvas.height*0.7); // translate nothing on 'x', but the 'y' value of the car. 'Canvas.height' will move the cars location on the camera position.

    road.draw(ctx);
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
}