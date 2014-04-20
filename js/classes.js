// Class which enables inheritance and polymorphism
InheritanceManager = {};
InheritanceManager.extend = function (subClass, baseClass) {
    function Inheritance() {};
    Inheritance.prototype = baseClass.prototype;
    subClass.prototype = new Inheritance();
    subClass.prototype.constructor = subClass;
    subClass.baseConstructor = baseClass;
    subClass.superClass = baseClass.prototype;
};


// Class which represents x & y coordinates
Point = function(x, y) {
    this.x = x;
    this.y = y;
};


// Base class for any shape
Shape = function(startPoint, endPoint, color) {
    this.start = startPoint;
    this.end = endPoint;
    this.current = this.start;
    this.velocity = Config.canvas1.particleVelocity; // px per animation cycle
    this.color = color;
};

Shape.prototype = {
    move: function() {
       // this.current.y += this.velocity;
    },
    // This is our "virtual" draw method
    draw: function (context) {
        alert('draw shape');
    }
};


// Class for rectangular shape
Rectangular = function (startPoint, endPoint, color) {
    this.current = this.startPoint;
    this.velocity = Config.canvas1.particleVelocity;
    Rectangular.baseConstructor.call(this, startPoint, endPoint, color);
};

// Rectangular inherits Shape
InheritanceManager.extend(Rectangular, Shape);

Rectangular.prototype = {
    // This method just calls the method from parent class
    move: function() {
        this.current.y += this.velocity;
        //Rectangular.superClass.move();
    },
    // This method overrides inherited "draw" method
    draw: function (context) {
        // TODO: Drawing logic goes here
        if (!Lib.isUndefinedNullOrEmpty(this.color)) {
            context.fillStyle = this.color;
        }
        context.fillRect(this.start.x, this.start.y, blockDefaultWidth, blockDefaultHeight);
        //context.strokeRect(this.start.x, this.start.y, blockDefaultWidth, blockDefaultHeight);
        if (!Lib.isUndefinedNullOrEmpty(this.color)) {
            context.fillStyle = "Black";
        }
    }
};


// Class for triangle shape
Triangle = function (startPoint, endPoint, direction, color) {
    Triangle.baseConstructor.call(this, startPoint, endPoint, color);
    this.velocity = Config.canvas1.particleVelocity;
    this.direction = direction;
};

// Triangle inherits Shape
InheritanceManager.extend(Triangle, Shape);

Triangle.prototype = {
    // This method just calls the method from parent class
    move: function() {
        this.start.y += this.velocity;
    },
    // This method overrides inherited "draw" method
    draw: function (context) {
        context.beginPath();
        context.moveTo(this.start.x, this.start.y);

        switch (this.direction) {
            case "SE":
                context.lineTo(this.start.x - blockDefaultWidth, this.start.y);
                context.lineTo(this.start.x - blockDefaultWidth, this.start.y + blockDefaultHeight);
                break;
            case "SW":
                context.lineTo(this.start.x + blockDefaultWidth, this.start.y);
                context.lineTo(this.start.x + blockDefaultWidth, this.start.y + blockDefaultHeight);
                break;
            case "NE":
                context.moveTo(this.start.x, this.start.y - blockDefaultHeight);
                context.lineTo(this.start.x, this.start.y);
                context.lineTo(this.start.x + blockDefaultWidth, this.start.y);
                break;
            default:
                context.lineTo(this.start.x + blockDefaultWidth, this.start.y);
                context.lineTo(this.start.x + blockDefaultWidth, this.start.y - blockDefaultHeight);
                break;
        }
        context.closePath();
        if (!Lib.isUndefinedNullOrEmpty(this.color)) {
            context.fillStyle = this.color;
        }
        context.fill();
        if (!Lib.isUndefinedNullOrEmpty(this.color)) {
            context.fillStyle = "Black";
        }
    }
};

// Class for curved triangle shape
CurvedTriangle = function (startPoint, endPoint, direction, color) {
    CurvedTriangle.baseConstructor.call(this, startPoint, endPoint, color);
    this.velocity = Config.canvas1.particleVelocity;
    this.direction = direction;
};

// CurvedTriangle inherits Shape
InheritanceManager.extend(CurvedTriangle, Shape);

CurvedTriangle.prototype = {
    // This method just calls the method from parent class
    move: function() {
        this.start.y += this.velocity;
    },
    // This method overrides inherited "draw" method
    draw: function (context) {
        context.beginPath();
        context.moveTo(this.start.x, this.start.y);

        switch (this.direction) {
            case "SE":
                context.lineTo(this.start.x - blockDefaultWidth, this.start.y);
                context.lineTo(this.start.x - blockDefaultWidth, this.start.y + blockDefaultHeight);
                context.quadraticCurveTo(this.start.x - blockDefaultWidth, this.start.y, this.start.x, this.start.y);
                break;
            case "SW":
                context.lineTo(this.start.x + blockDefaultWidth, this.start.y);
                context.lineTo(this.start.x + blockDefaultWidth, this.start.y + blockDefaultHeight / 2);
                context.quadraticCurveTo(this.start.x + blockDefaultWidth, this.start.y, this.start.x, this.start.y);
                break;
            case "NE":
                //context.moveTo(this.start.x, this.start.y - blockDefaultHeight);
                context.lineTo(this.start.x, this.start.y + blockDefaultHeight);
                context.lineTo(this.start.x + blockDefaultWidth, this.start.y + blockDefaultHeight);
                context.quadraticCurveTo(this.start.x, this.start.y + blockDefaultHeight, this.start.x, this.start.y);
                break;
            default:
                context.lineTo(this.start.x + blockDefaultWidth, this.start.y);
                context.lineTo(this.start.x + blockDefaultWidth, this.start.y - blockDefaultHeight / 2);
                context.quadraticCurveTo(this.start.x + blockDefaultWidth, this.start.y, this.start.x, this.start.y);
                break;
        }
        //context.closePath();
        //context.bezierCurveTo(75,37,70,25,50,25);
        if (!Lib.isUndefinedNullOrEmpty(this.color)) {
            context.fillStyle = this.color;
        }
        context.fill();
        if (!Lib.isUndefinedNullOrEmpty(this.color)) {
            context.fillStyle = "Black";
        }
    }
};

// Class for Custom shape 1: top of i letter
CustomShape1 = function (startPoint, endPoint, color) {
    CustomShape1.baseConstructor.call(this, startPoint, endPoint, color);
    this.velocity = Config.canvas1.particleVelocity;
};

// CustomShape1 inherits Shape
InheritanceManager.extend(CustomShape1, Shape);

CustomShape1.prototype = {
    // This method just calls the method from parent class
    move: function() {
        this.start.y += this.velocity;
    },
    // This method overrides inherited "draw" method
    draw: function (context) {
        context.beginPath();
        context.moveTo(this.start.x, this.start.y - blockDefaultHeight);
        context.lineTo(this.start.x, this.start.y);
        context.lineTo(this.start.x + 2 * blockDefaultWidth, this.start.y);
        context.lineTo(this.start.x + 2 * blockDefaultWidth, this.start.y - blockDefaultHeight);
        context.quadraticCurveTo(this.start.x + blockDefaultWidth / 2, this.start.y - blockDefaultHeight / 2, this.start.x, this.start.y - blockDefaultHeight);

        if (!Lib.isUndefinedNullOrEmpty(this.color)) {
            context.fillStyle = this.color;
        }
        context.fill();
        if (!Lib.isUndefinedNullOrEmpty(this.color)) {
            context.fillStyle = "Black";
        }
    }
};
// Class for TextBox shape
TextBox = function (startPoint, endPoint, text, color, fontSize, fontType) {
    if (startPoint.y <= endPoint.y)
        return;
    this.x = startPoint.x;
    this.y = startPoint.y;
    this.endX = endPoint.x;
    this.endY = endPoint.y;
    this.velocity = Config.canvas2.particleVelocity;
    this.fontSize = fontSize;
    this.fontType = fontType;
    this.fillColor = color;
    this.factoryText = text;
};

TextBox.prototype = {

    move: function() {
        this.y = this.y - this.velocity;

    },

    draw: function(context) {
        context.save();
        context.font = this.refreshFont();
        context.fillStyle = this.fillColor;
        context.textAlign = Config.canvas2.fontAlignment;
        context.fillText(this.factoryText, this.x, this.y);
        context.restore();
    },

    shouldContinue: function() {
        return this.y > this.endY;
    },

    refreshFont: function() {
        if (this.fontSize < Config.canvas2.maxFontSize)
            this.fontSize += Config.canvas2.increaseFontSizeBy;
        return this.fontSize + "pt " + this.fontType;
    }

};

angle = 0;
function incrementAngle() {
    angle+= 1.7;
    if(angle > 360) {
        angle = 0;
    }
}


// Class for circle shape
Circle = function (startPoint, endPoint, radius, fillColor) {
    Circle.baseConstructor.call(this, startPoint, endPoint);
    this.radius = radius;
    this.fillColor = fillColor;
    this.velocity = Config.canvas3.particleVelocity;
    this.start = startPoint;
    this.end = endPoint;
    this.imagePath = null;
    this.angle = 0;
};

// Rectangular inherits Shape
InheritanceManager.extend(Circle, Shape);
Circle.prototype = {
    // This method just calls the method from parent class
    move: function() {
        this.start.x =  this.start.x - this.velocity;
        this.start.y = (Math.sin(Lib.degreesToRadians(2 * this.start.x % 360)))  * 50 + 225;
        incrementAngle();
    },

    incrementAngle: function() {
        this.angle++;
        if(this.angle > 360) {
            this.angle = 0;
        }
    },

    // This method overrides inherited "draw" method
    draw: function (context) {
        context.save();
        if (this.imagePath === null) {
            context.fillStyle = this.fillColor;
            context.beginPath();
            context.arc(this.start.x, this.start.y, this.radius, 0, 2 * Math.PI, false);
            context.closePath();
            context.fill();
        } else {
            var startX = this.start.x;
            var startY = this.start.y;
            var globe = $(".globe_image")[0];
            var radians = Lib.degreesToRadians(this.angle);
            var newX =  startX * Math.cos(radians) - startY * Math.sin(radians);
            var newY = startX * Math.sin(radians) + startY * Math.cos(radians);
            context.translate(newX, newY);
            context.rotate(angle * Math.PI / 180);
            context.translate(-newX, -newY);
            context.drawImage(globe, newX - globe.width / 2, newY - globe.height / 2, globe.width, globe.height);
        }
        context.restore();
    },

    shouldContinue: function() {
        return this.start.x - 5 > this.end.x;
    }

};


// Class for arror shape
Arrow = function (startPoint, endPoint, radius, fillColor) {
    Circle.baseConstructor.call(this, startPoint, endPoint);
    this.radius = radius;
    this.fillColor = fillColor;
    this.velocity = Config.canvas4.particleVelocity;
    this.start = startPoint;
    this.end = endPoint;
    this.imagePath = null;
};
//InheritanceManager.extend(Arrow, Shape);
Arrow.prototype = {
    // This method just calls the method from parent class
    move: function() {
        this.start.x -= this.velocity * 0.72;
        this.start.y -= this.velocity * 0.72;
    },
    // This method overrides inherited "draw" method
    draw: function (context) {
        context.save();
        if (this.imagePath === null) {
            context.fillStyle = "rgb(255, 0, 0)";
            context.beginPath();
            context.arc(this.start.x, this.start.y, this.radius, 0, 2 * Math.PI, false);
            context.closePath();
            context.fill();
        } else {
            var image = new Image();
            image.src =   this.imagePath;
            var startX = this.start.x;
            var startY = this.start.y;
            var arrow = $(".arrow_image")[0];
            context.drawImage(arrow, startX, startY);
        }
        context.restore();




    },
    shouldContinue: function() {
        return this.start.x > this.end.x;
    }

};

// Class for Custom shape 2: top and bottom left shapes on letter C
CustomShape2 = function (startPoint, endPoint, direction, color) {
    CustomShape2.baseConstructor.call(this, startPoint, endPoint, color);
    this.velocity = Config.canvas1.particleVelocity;
    this.direction = direction;
};

// CustomShape2 inherits Shape
InheritanceManager.extend(CustomShape2, Shape);

CustomShape2.prototype = {
    // This method just calls the method from parent class
    move: function() {
        this.start.y += this.velocity;
    },
    // This method overrides inherited "draw" method
    draw: function (context) {
        context.beginPath();
        context.moveTo(this.start.x, this.start.y);

        switch (this.direction) {
            case "SE":
                context.lineTo(this.start.x, this.start.y - blockDefaultHeight);
                context.lineTo(this.start.x + blockDefaultWidth, this.start.y - blockDefaultHeight);
                context.lineTo(this.start.x + blockDefaultWidth, this.start.y - blockDefaultHeight /2);
                context.quadraticCurveTo(this.start.x + blockDefaultWidth, this.start.y, this.start.x, this.start.y);
                break;
            case "SW":
                context.moveTo(this.start.x - blockDefaultWidth / 2, this.start.y);
                context.lineTo(this.start.x + 2 * blockDefaultWidth, this.start.y);
                context.lineTo(this.start.x + 2 * blockDefaultWidth, this.start.y + 2 * blockDefaultHeight);
                context.quadraticCurveTo(this.start.x, this.start.y + 2 * blockDefaultHeight, this.start.x - blockDefaultWidth / 2, this.start.y);
                break;
            case "NE":
                context.lineTo(this.start.x, this.start.y + blockDefaultHeight);
                context.lineTo(this.start.x + blockDefaultWidth, this.start.y + blockDefaultHeight);
                context.lineTo(this.start.x + blockDefaultWidth, this.start.y + blockDefaultHeight / 2);
                context.quadraticCurveTo(this.start.x + blockDefaultWidth, this.start.y, this.start.x, this.start.y);
                break;
            default:
                context.moveTo(this.start.x - blockDefaultWidth / 2, this.start.y);
                context.lineTo(this.start.x + 2 * blockDefaultWidth, this.start.y);
                context.lineTo(this.start.x + 2 * blockDefaultWidth, this.start.y - 2 * blockDefaultHeight);
                context.quadraticCurveTo(this.start.x, this.start.y - 2 * blockDefaultHeight, this.start.x - blockDefaultWidth / 2, this.start.y);
                break;
        }
        if (!Lib.isUndefinedNullOrEmpty(this.color)) {
            context.fillStyle = this.color;
        }
        //context.stroke();
        context.fill();
        if (!Lib.isUndefinedNullOrEmpty(this.color)) {
            context.fillStyle = "Black";
        }
    }
};