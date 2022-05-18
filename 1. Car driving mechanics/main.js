const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");
const car = new Car(100, 100, 30, 50);

animate();

function animate() {
    car.update();

    canvas.height = window.innerHeight; // by calling this here (instead of in line 3 like it was previously) it causes the canvas to get cleared. If we called it in line 3, the black car square would just get taller/longer. It needs to be cleared to look like the car is animating.
    car.draw(ctx);
    requestAnimationFrame(animate); // calls animate() again and again, giving the illusion of movement. 
}