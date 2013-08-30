var MazeGenerator = function (x, y) {

    var Direction = function (bit, dx, dy) {
        this.bit = bit;
        this.dx = dx;
        this.dy = dy;
        this.opposite;
    };
    
    var N = new Direction(1, 0, -1);
    var S = new Direction(2, 0, 1);
    var E = new Direction(4, 1, 0);
    var W = new Direction(8, -1, 0);
    
    N.opposite = S;
    S.opposite = N;
    E.opposite = W;
    W.opposite = E;

    this.x = x;
    this.y = y;
    this.dirs = [N, S, E, W];
    this.maze = new Array(this.x);

    var i, j;
    for (i = 0; i < this.x; i++) {
        this.maze[i] = new Array(this.y);
        for (j = 0; j < this.y; j++) {
            this.maze[i][j] = 0;
        }
    }

    this.display = function () {
        var i, j, line;

        for (i = 0; i < y; i++) {
            // draw the north edge
            line = "";
            for (j = 0; j < x; j++) {
                line += (this.maze[j][i] & 1) === 0 ? "+---" : "+   ";
            }

            console.log(line + "+");
            // draw the west edge
            line = "";
            for (j = 0; j < x; j++) {
                line += (this.maze[j][i] & 8) === 0 ? "|   " : "    ";
            }
            console.log(line + "|");
        }

        // draw the bottom line

        line = "";
        for (j = 0; j < x; j++) {
            line += "+---";
        }

        console.log(line + "+");
    };

    var _this = this;

    this.generateMaze = function (cx, cy) {

        shuffle(this.dirs).forEach(function (dir) {
            var nx = cx + dir.dx;
            var ny = cy + dir.dy;
            if (between(nx, x) && between(ny, y) && (_this.maze[nx][ny] === 0)) {
                _this.maze[cx][cy] |= dir.bit;
                _this.maze[nx][ny] |= dir.opposite.bit;
                _this.generateMaze(nx, ny);
            }
        });
    };

    function shuffle(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    function between(v, upper) {
        return (v >= 0) && (v < upper);
    }

    this.generateMaze(0, 0);

};

new MazeGenerator(30, 10).display();