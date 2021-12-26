let socket = io();

let name = prompt('Type here nickname');
socket.emit("newPlayer", name);

socket.on("startGame", (screenParams) => {
    console.log("game start on client");

    // update data from server
    let headers, players, cars, interval;
    socket.on("updateGame", (data) => {
        if (data) {
            if (data.headers) headers = data.headers;
            if (data.players) players = data.players;
            if (data.cars) cars = data.cars;
        }
    })

    // Send key to server
    window.addEventListener('keydown', function (e) {
        socket.volatile.emit("control", e.code, true);
    });

    window.addEventListener('keyup', function (e) {
        socket.volatile.emit("control", e.code, false);
    });

    let ctx = initCtx(screenParams.width, screenParams.height);

    // test screen
    // let t = 25;
    //
    // ctx.fillStyle = "#FFFFFF"
    // ctx.fillRect(0, 0, t, t);
    // ctx.fillRect(screenParams.width - t, 0, t, t);
    // ctx.fillRect(0, screenParams.height - t, t, t);
    // ctx.fillRect(screenParams.width - t, screenParams.height - t, t, t);
    // ctx.fillRect(screenParams.width / 2 - t, screenParams.height / 2 - t, t, t);

    interval = setInterval(() => {
        draw(ctx, headers, players, cars, screenParams);
    }, screenParams.fps)
})

function initCtx(screenWidth, screenHeight) {
    let field = document.getElementById("field");

    field.width = screenWidth;
    field.height = screenHeight;

    return field.getContext('2d');
}

function draw(ctx, headers, players, cars, screenParams) {
    ctx.clearRect(0, 0, screenParams.width, screenParams.height);

    if (headers) {
        if (document.getElementById("scoreboard")) {
            document.getElementById("scoreboard").innerHTML = "";
        }
        for (let header of headers) {
            if (!document.getElementById(header.id)) {
                let div = document.getElementById("scoreboard").appendChild(document.createElement("div"));
                div.setAttribute("id", header.id);
                div.classList.add("txt");
                div.style.color = header.color;
            }

            document.getElementById(header.id).innerText = header.name + " - " + header.points + " points";
        }
    }

    if (players) {
        for (let player of players) {
            ctx.save();
            ctx.fillStyle = player.color;
            ctx.fillRect(player.position.x, player.position.y, player.size.length, player.size.height);
            ctx.restore();
            // document.getElementById("position").innerText = JSON.stringify(player.position)
        }
    }

    if (cars) {
        for (let car of cars) {
            ctx.save();
            ctx.fillStyle = car.color;
            ctx.fillRect(car.position.x, car.position.y, car.size.length, car.size.height);
            ctx.restore();
        }
    }
}
