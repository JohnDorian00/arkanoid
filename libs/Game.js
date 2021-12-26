const {Player} = require("./Player");
const {Car} = require("./Car");

class Game {
    io

    screenWidth
    screenHeight
    fps

    players
    playerSize
    playerSpeed

    cars
    intervalId

    constructor(io) {
        this.io = io;

        // default params
        this.playerSize = {length: 40, height: 40};
        this.playerSpeed = 6;
        this.screenWidth = 1920;
        this.screenHeight = 1080;
        this.fps = 10;

        // init
        this.players = new Map();
        this.intervalId = undefined;
        this.cars = [];

        // make cars
        let screenParams = this.getScreenParams();
        for (let i = 0; i < 25; i++) {
            this.cars.push(new Car({length: 200, height: 100}, 5, "#FFFFFF", screenParams));
        }

        console.log("game is init");
        this.run();
    }

    run() {
        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.calcAll();
                this.io.volatile.emit("updateGame", this.dataToClients());
            }, this.fps)
            console.log("game started\n");
        } else {
            console.log("game already started");
        }
    }

    calcAll() {
        for (let car of this.cars) {
            car.move();
        }

        for (let player of this.players.values()) {
            player.move();
            this.calcScreenBorder(player);

            this.allIntersectionCheck();

            // finish check
            if (this.checkFinish(player)) {
                player.points = ++player.points;
                player.backToStart();
            }
        }
    }

    calcScreenBorder(player) {
        if (player.position.y < 0) {
            player.position.y = 0;
        }
        if (player.position.x < 0) {
            player.position.x = 0;
        }
        if (player.position.y > this.screenHeight - player.size.height) {
            player.position.y = this.screenHeight - player.size.height;
        }
        if (player.position.x > this.screenWidth - player.size.length) {
            player.position.x = this.screenWidth - player.size.length;
        }
    }

    intersectionCheck(entity1, entity2) {
        let c1 = entity1.getAllCoordinates(),
            c2 = entity2.getAllCoordinates();

        for (let vertex in c1) {
            if (c1[vertex].x > c2.A.x && c1[vertex].x < c2.B.x && c1[vertex].y > c2.A.y && c1[vertex].y < c2.D.y) {
                return true
            }
        }

        return false
    }

    allIntersectionCheck() {
        this.players.forEach((player, k) => {
            this.cars.forEach((car) => {
                if (this.intersectionCheck(player, car)) {
                    player.backToStart();
                }
            })
        })
    }

    checkFinish(player) {
        if (player.position.y < 100) {
            return true
        }
    }

    stop() {
        clearInterval(this.intervalId);
        this.intervalId = undefined;
    }

    reboot() {
        this.stop();
        this.run();
    }

    dataToClients() {
        let data = {
            headers: [],
            players: [],
            cars: []
        };

        for (let player of this.players.values()) {
            data.headers.push({
                id: player.id,
                name: player.name,
                points: player.points,
                color: player.color
            })
            data.players.push({
                color: player.color,
                position: player.position,
                size: player.size,
                name: player.name
            })
        }

        for (let car of this.cars) {
            data.cars.push({
                color: car.color,
                position: car.position,
                size: car.size
            })
        }

        return data
    }

    playerChangeControls(id, key, value) {
        if (key === "KeyW" || key === "KeyA" || key === "KeyS" || key === "KeyD") {
            if (this.players.get(id)) {
                this.players.get(id).controls[key] = value;
            }
        }
    }

    addPlayer(id, name) {
        let x;

        switch (this.players.size) {
            case 0:
                x = 400;
                break;
            case 1:
                x = 800;
                break;
            case 2:
                x = 1200;
                break;
            case 3:
                x = 1600;
                break;
            default:
                return false;
        }

        let player = new Player(id, name, this.playerSize, this.playerSpeed, this.getRandomColor(), {x: x, y: 1000})
        this.players.set(id, player);
        return true;
    }

    deletePlayer(id) {
        this.players.delete(id);
    }

    getPlayers() {
        return this.players
    }

    getRandomColor() {
        return hslToHex(Math.floor(Math.random() * 360), 100, 50)

        function hslToHex(h, s, l) {
            l /= 100;
            const a = s * Math.min(l, 1 - l) / 100;
            const f = n => {
                const k = (n + h / 30) % 12;
                const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
            };
            return `#${f(0)}${f(8)}${f(4)}`;
        }
    }

    getScreenParams() {
        return {
            width: this.screenWidth,
            height: this.screenHeight,
            fps: this.fps
        }
    }
}

module.exports = {
    Game: Game
};
