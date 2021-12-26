class Entity {
    position
    speed
    size
    color

    constructor(size, speed, color) {
        if (size) this.size = size;
        if (Number.isInteger(speed)) this.speed = speed;
        if (color) this.color = color;
    }
    
    move(direction) {
        switch (direction) {
            case "up":
                this.position.y -= this.speed;
                break;
            case "right":
                this.position.x += this.speed;
                break;
            case "down":
                this.position.y += this.speed;
                break;
            case "left":
                this.position.x -= this.speed;
                break;
        }
    }

    getAllCoordinates() {
        return {
            A: {x: this.position.x, y: this.position.y},
            B: {x: this.position.x + this.size.length, y: this.position.y},
            C: {x: this.position.x + this.size.length, y: this.position.y + this.size.height},
            D: {x: this.position.x, y: this.position.y + this.size.height},
            center: {x: this.position.x + this.size.length / 2, y: this.position.y + this.size.height / 2}
        }
    }

    set position(position) {
        this.position = position;
    }

    get position() {
        return this.position
    }
}

module.exports = {
    Entity: Entity
};
