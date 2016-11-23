import { Component } from 'react';

class SandTimer extends Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.sand_timer = null;
    this.ctx = null;
    this.canvas = null; 
    this.grid = [270];
    this.gridBounds = [270]; 
    this.leftBoundary = null; 
    this.rightBoundary = null; 
    this.ceiling = 52; 
    this.floor = 268;
    // http://en.wikipedia.org/wiki/Desert_sand_(color)
    this.sandColours = ["#967117", "#C2B280", "#F4A460", "#E1A95F"]; 
    this.currentDrawPhase = 1;
    this.iFirstRowOfSand = 159; 
    this.id = (this.props && this.props.id) ? this.props.id : "canvas-for-send-timer-id"; 
    this.debugX = 217; 
    this.debugY = 141; 
    this.iNilMoveCounter = 0;
    this.bSandHitBottom = false;
  }
  clearCanvas() {
    // clear canvas
    this.ctx.clearRect(0, 0, this.canvas.height, this.canvas.width);
  }
  drawBoundary(boundary) {
    var iCounter = 0, current = null;

    this.ctx.beginPath();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "black";

    for ( iCounter = 0; iCounter < boundary.length; iCounter++) {

        current = boundary[iCounter];

        if (iCounter === 0) {
            this.ctx.moveTo(current[0], current[1]);
        }

        this.ctx.lineTo(current[0], current[1]);
    }

    this.ctx.stroke();
  }
  drawBoundaryLines(x1, x2, y) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y);
    this.ctx.lineTo(x2, y);
    this.ctx.stroke();
  }
  drawSandBoundary() {
    this.drawBoundary(this.rightBoundary);
    this.drawBoundary(this.leftBoundary);
    this.drawBoundaryLines(140, 259, this.ceiling);
    this.drawBoundaryLines(141, 259, this.floor);
  }
  findXAtY(y, boundary) {
    var x = 0, iCounter = 0, current = null;
    for ( iCounter = 0; iCounter < boundary.length; iCounter++) {
        current = boundary[iCounter];
        if (y <= current[1]) {
            x = current[0];
            iCounter = boundary.length;
        }

    }
    return x;
  }
  drawBackground() {
    this.clearCanvas();
    this.ctx.drawImage(this.sand_timer, 0, 0);
  }
  initSandForRow(x1, x2, y) {
    var iXCounter = x1;
    for (iXCounter; iXCounter <= x2; iXCounter++) {
        this.grid[y][iXCounter] = {
            x : iXCounter,
            y : y,
            colour : this.sandColours[Math.floor((Math.random() * this.sandColours.length))],
            occupied : true
        };
    }
  }
  initEmptyRow(x1, x2, y) {
    var iXCounter = x1;
    for (iXCounter; iXCounter <= x2; iXCounter++) {
        this.grid[y][iXCounter] = {
            x : iXCounter,
            y : y,
            colour : 'white',
            occupied : false
        };
    }
  }
  initSand() {
    var iYCounter = 0, iXMin = 0, iXMax = 0;
    for ( iYCounter = this.floor; iYCounter >= this.ceiling; iYCounter--) {
        iXMin = this.findXAtY(iYCounter, this.leftBoundary);
        iXMax = this.findXAtY(iYCounter, this.rightBoundary);
        this.gridBounds[iYCounter] = [iXMin, iXMax];
        this.grid[iYCounter] = [iXMax - iXMin];
        if (iYCounter > this.ceiling + 50 && iYCounter <= 159) {
            this.initSandForRow(iXMin, iXMax, iYCounter);
        } else {
            this.initEmptyRow(iXMin, iXMax, iYCounter);
        }
    }
  }
  drawSandParticle(current) {
    if (current !== undefined) {
        this.ctx.strokeStyle = current.colour;
        this.ctx.fillStyle = current.colour;
        this.ctx.fillRect(current.x, current.y, 1, 1);
    }
  }
  applyGravity(iXAdjust, iYAdjust) {
    var iYCounter = false, iXCounter = false, sand = null, cell = null, iXMin = null, iXMax = null, bRowHasSand = false, bHasMoved = false;
    if (this.iFirstRowOfSand >= this.floor) {
        this.iFirstRowOfSand = this.floor - 1;
    }

    for ( iYCounter = this.iFirstRowOfSand; iYCounter >= this.ceiling; iYCounter--) {
        iXMin = this.gridBounds[iYCounter + iYAdjust][0];
        iXMax = this.gridBounds[iYCounter + iYAdjust][1];
        bRowHasSand = false;
        for ( iXCounter = iXMin; iXCounter <= iXMax; iXCounter++) {
            sand = this.grid[iYCounter][iXCounter];
            cell = this.grid[iYCounter + iYAdjust][iXCounter + iXAdjust];
            bHasMoved = false;
            if (sand !== undefined && sand.occupied === true) {
                if (cell !== undefined && cell.occupied === false) {
                    // Sand in target cell?
                    if (sand.x >= iXMin && sand.x <= iXMax) {
                        //Swap the sand cells
                        this.grid[iYCounter + iYAdjust][iXCounter + iXAdjust].colour = sand.colour;
                        this.grid[iYCounter + iYAdjust][iXCounter + iXAdjust].occupied = true;
                        this.grid[iYCounter][iXCounter].colour = 'white';
                        this.grid[iYCounter][iXCounter].occupied = false;
                        bHasMoved = true;
                    }
                }

                bRowHasSand = true;
            }
        }

        //Exit the loop if the row has no sand
        if (bRowHasSand === false) {
            iYCounter = this.ceiling - 1;
        }
    }

    this.iFirstRowOfSand++;

    return bHasMoved;
  }
  cleanUp() {
    var iCleanUpRows, iXCounter;
    // Have we hit the bottom?
    if (this.grid[this.floor][200].occupied === true) {

        // Clean up the sand that defies gravity :-)
        for ( iCleanUpRows = this.ceiling; iCleanUpRows < this.floor; iCleanUpRows++) {
            if (this.grid[iCleanUpRows][200].occupied === false) {
                this.iXMin = this.gridBounds[iCleanUpRows][0];
                this.iXMax = this.gridBounds[iCleanUpRows][1];

                // Iterate from left to right within the boundaries
                for ( iXCounter = this.iXMin; iXCounter <= this.iXMin + 4; iXCounter++) {
                    this.grid[iCleanUpRows][iXCounter].occupied = false;
                    this.grid[iCleanUpRows][iXCounter].colour = 'white';
                }
                // Iterate from right to left within the boundaries
                for ( iXCounter = this.iXMax; iXCounter >= this.iXMax - 4; iXCounter--) {
                    this.grid[iCleanUpRows][iXCounter].occupied = false;
                    this.grid[iCleanUpRows][iXCounter].colour = 'white';
                }
            }
        }
    }
  }
  drawSandParticles() {
    var iYCounter = 0, 
        iXCounter = 0,  
        iStepCounter = 4;

    this.drawBackground();
    // Adjust the sand by x number of steps
    while (iStepCounter >= 0) {
        // Allow any particle to move down
        this.bHasMoved = this.applyGravity(0, 1);

        // Allow any particle to move left/right
        this.bHasMovedRight = this.applyGravity(1, 1);
        this.bHasMovedLeft = this.applyGravity(-1, 1);

        iStepCounter--;

        if (this.bHasMoved === false && this.bHasMovedRight === false && this.bHasMoved === false) {
            this.iNilMoveCounter++;
        }
    }

    this.cleanUp();

    // Draw the sand in the new location
    for ( iYCounter = this.floor; iYCounter >= this.ceiling; iYCounter--) {

        this.iXMin = this.gridBounds[iYCounter][0];
        this.iXMax = this.gridBounds[iYCounter][1];

        // Iterate from left to right within the boundaries
        for ( iXCounter = this.iXMin; iXCounter <= this.iXMax; iXCounter++) {

            this.drawSandParticle(this.grid[iYCounter][iXCounter]);

        }
    }

    // Draw the boundary line
    this.drawSandBoundary();

    return (this.iNilMoveCounter > 250);
  }
  initBoundary() {
    this.leftBoundary = [
        [142, 51], [140, 54], [140, 59], [139, 64], [139, 69], [139, 74], [139, 79], [140, 84], [141, 89], [142, 94], 
        [144, 99], [146, 104], [150, 109], [153, 114], [158, 119], [160, 122], [162, 124], [165, 127], [167, 129], [169, 131], 
        [173, 134], [176, 136], [180, 139], [183, 141], [186, 144], [188, 146], [190, 149], [191, 150], [193, 154], [195, 159],
        // Middle
        [195, 164], [193, 169], [188, 174], [183, 179], [177, 184], [170, 189], [164, 194], [158, 199], [154, 204], [150, 209], 
        [147, 214], [145, 219], [142, 224], [141, 229], [140, 234], [139, 239], [139, 244], [139, 249], [139, 254], [139, 259], 
        [140, 264], [142, 269]
    ];

    this.rightBoundary = [
        [259, 51], [260, 54], [261, 59], [262, 64], [262, 69], [262, 74], [261, 79], [260, 84], [258, 89], [257, 94], 
        [255, 99], [253, 104], [251, 109], [247, 114], [243, 119], [239, 124], [237, 126], [234, 129], [229, 134], [226, 136], [224, 138], 
        [222, 139], [219, 141], [216, 144], [215, 144], [212, 147], [210, 149], [208, 151], [206, 154], [205, 159],
        // Middle
        [205, 164], [207, 169], [211, 174], [217, 179], [225, 184], [231, 189], [236, 194], [241, 199], [245, 204], [249, 209], [252, 214], 
        [255, 219], [257, 224], [259, 229], [260, 234], [261, 239], [261, 244], [261, 249], [260, 254], [260, 259], [259, 264], [257, 269]
    ];
  }
  animate() {
    if (this.drawSandParticles() === false) {
      setTimeout(() => this.animate(), 100);
    }
  }
  init() {
    // Grab the canvas element
    this.canvas = document.getElementById(this.id);
    // Canvas supported?
    if (this.canvas && this.canvas.getContext('2d')) {
        this.ctx = this.canvas.getContext('2d');
        // Load the timer
        this.sand_timer = new Image();
        this.sand_timer.src = 'hourglass.jpg';
        this.sand_timer.onload = () => {
            this.initBoundary();
            this.initSand();
            this.drawBackground();
        };
    } else {
        alert("Canvas not supported!");
    }
  } 
  start() {
    if(this.canvas) {
      this.initSand();
      this.iFirstRowOfSand = 159; 
      this.iNilMoveCounter = 0;
      this.animate();
    }
  }
}

export default SandTimer;