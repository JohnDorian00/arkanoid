const {Entity} = require("./Entity");

class Car extends Entity {
    direction
    screenParams

    constructor(size, speed, color, screenParams) {
        super(size, speed, color);
        this.screenParams = screenParams;
        this.randomizeCar();
    }

    move() {
        if (this.direction === 0) {
            super.move("right");
        } else {
            super.move("left");
        }

        if (this.direction === 0 && this.position.x > this.screenParams.width + this.size.length ||
            this.direction === 1 && this.position.x < -this.size.length) {
            this.randomizeCar();
        }
    }

    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    randomizeCar() {
        let direction = this.randomNumber(0, 1),
            speed = this.randomNumber(3, 15),
            y = this.randomNumber(2, 8) * 100, x;

        if (direction === 0) {
            x = this.randomNumber(1, 50) * -100;
        } else {
            x = this.randomNumber(1, 50) * 100 + 1920;
        }

        this.position = {x: x, y: y};
        this.direction = direction;
        // this.speed = 10;
    }
}


module.exports = {
    Car: Car
};
