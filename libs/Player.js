const {Entity} = require("./Entity");

class Player extends Entity {
    id
    name;
    points;
    controls;
    startedPosition;

    constructor(id, name, size, speed, color, startedPosition) {
        super(size, speed, color);
        this.id = id;
        this.name = name;
        this.points = 0;
        this.controls = {
            "KeyW": false,
            "KeyA": false,
            "KeyS": false,
            "KeyD": false
        }
        this.startedPosition = startedPosition;
        this.backToStart();
    }

    move() {
        if (this.controls["KeyW"]) super.move("up")
        if (this.controls["KeyA"]) super.move("left")
        if (this.controls["KeyS"]) super.move("down")
        if (this.controls["KeyD"]) super.move("right")
    }

    backToStart() {
        this.position = {x: this.startedPosition.x, y: this.startedPosition.y};
    }

    set points(point) {
        this.points = point;
    }

    get points() {
        return this.points
    }

    set startedPosition(startedPosition) {
        this.startedPosition = startedPosition
    }
}


module.exports = {
    Player: Player
};
