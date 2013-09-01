var MazeGenerator = function (x, y) {

    var WALL = 0;
    var ROOM = 1;

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
    this.maze = initArray(this.x, this.y, 0);
    this.bitMaze; 

    this.getMaze = function() {
        return this.bitMaze;    
    };

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
    
    this.generateMaze = function (cx, cy) {

        var _this = this;

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

    function initArray(x, y, v) {
        
        var array = new Array(x);
        var i, j;
        
        for (i = 0; i < x; i++) {
            array[i] = new Array(y);
            for (j = 0; j < y; j++) {
                array[i][j] = v;
            }
        }
        
        return array;    
    }
    
    function convertToBitMaze(maze, x, y) {
        var i, j;

        var bitMaze = initArray(x * 2 + 1, y * 2 + 1, WALL);

        for (i = 0; i < y; i++) {
            for (j = 0; j < x; j++) {
                
                if((maze[j][i] & 1) === 0) {
                    bitMaze[j*2][i*2] = WALL;
                    bitMaze[j*2+1][i*2] = WALL;
                } else {
                    bitMaze[j*2][i*2] = WALL;
                    bitMaze[j*2+1][i*2] = ROOM;
                }

                if((maze[j][i] & 8) === 0) {
                    bitMaze[j*2][i*2+1] = WALL;
                    bitMaze[j*2+1][i*2+1] = ROOM;
                } else {
                    bitMaze[j*2][i*2+1] = ROOM;
                    bitMaze[j*2+1][i*2+1] = ROOM;
                }
                
            }

        }
        
        return bitMaze;
    }
    
    this.generateMaze(0, 0);
    this.bitMaze = convertToBitMaze(this.maze, this.x, this.y);
};