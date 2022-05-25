const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS"); //we need to add 'keys' or we will only control the last traffic car
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2) //array of traffic cars
];

animate();

function animate() {
    for (let i = 0; i < traffic.length; i++) { //goes through all of the cars in our traffic and update and keep the borders in mind.
        traffic[i].update(road.borders, []); //by leaving this array empty, the traffic will not be able to damage the other traffic.
    }
    car.update(road.borders, traffic);

    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7);

    // Traffic
    road.draw(ctx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(ctx, "red"); //traffic car
    }
    car.draw(ctx, "blue"); //our car

    ctx.restore();
    requestAnimationFrame(animate);
}