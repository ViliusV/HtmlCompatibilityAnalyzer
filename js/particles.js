var offsetX = 100;
var offsetY = 100;
var blockDefaultWidth = 20;
var blockDefaultHeight = 20;
var getParticle = function (startPosition, multiplierX, multiplierY, color){
    return new Rectangular(new Point(offsetX + startPosition + blockDefaultWidth * multiplierX, offsetY - blockDefaultHeight * multiplierY),
        new Point(offsetX + startPosition + blockDefaultWidth * multiplierX, offsetY - blockDefaultHeight * multiplierY), color);
};
var getTriangle = function (startPosition, multiplierX, multiplierY, direction, color){
    return new Triangle(new Point(offsetX + startPosition + blockDefaultWidth * multiplierX, offsetY - blockDefaultHeight * multiplierY),
        new Point(offsetX + startPosition + blockDefaultWidth * multiplierX, offsetY - blockDefaultHeight * multiplierY), direction, color);
};
var getCurvedTriangle = function (startPosition, multiplierX, multiplierY, direction, color){
    return new CurvedTriangle(new Point(offsetX + startPosition + blockDefaultWidth * multiplierX, offsetY - blockDefaultHeight * multiplierY),
        new Point(offsetX + startPosition + blockDefaultWidth * multiplierX, offsetY - blockDefaultHeight * multiplierY), direction, color);
};
//Letter C
var getLetterCShape = function (startPosition, color) {
    var c = new Array();
    c.push(getParticle(startPosition,2,1, color));
    c.push(getParticle(startPosition,1,1, color));
    c.push(getTriangle(startPosition,0,1, 'SW', color));
    c.push(getParticle(startPosition,0,2, color));
    c.push(getParticle(startPosition,0,3, color));
    c.push(getParticle(startPosition,0,4, color));
    c.push(getParticle(startPosition,0,5, color));
    c.push(getTriangle(startPosition,0,5, 'NW', color));
    c.push(getParticle(startPosition,1,6, color));
    c.push(getParticle(startPosition,2,6, color));
    return c;
};
//Letter L
var getLetterLShape = function (startPosition, color) {
    var c = new Array();
    for (var i=1; i< 11; i++){
        c.push(getParticle(startPosition,0,i, color));
    }
    return c;
};

//Letter i
var getLetterIShape = function (startPosition, color) {
    var c = new Array();
    for (var i=1; i< 7; i++){
        c.push(getParticle(startPosition,0,i,color));
    }
    return c;
};

//Letter K
var getLetterKShape = function (startPosition, color) {
    var c = new Array();

    c.push(getTriangle(startPosition,4,1, 'SE', color));
    c.push(getTriangle(startPosition,2,1, 'SW', color));
    c.push(getParticle(startPosition,0,1, color));
    c.push(getTriangle(startPosition,3,1, 'NE', color));
    c.push(getParticle(startPosition,2,2, color));
    c.push(getTriangle(startPosition,1,2, 'SW', color));
    c.push(getParticle(startPosition,0,2, color));
    c.push(getTriangle(startPosition,2,2, 'NE', color));
    c.push(getParticle(startPosition,1,3, color));
    c.push(getParticle(startPosition,0,3, color));
    c.push(getTriangle(startPosition,3,4, 'SE', color));
    c.push(getParticle(startPosition,1,4, color));
    c.push(getParticle(startPosition,0,4, color));
    c.push(getTriangle(startPosition,4,5, 'SE', color));
    c.push(getParticle(startPosition,2,5, color));
    c.push(getTriangle(startPosition,1,4, 'NW', color));
    c.push(getParticle(startPosition,0,5, color));
    c.push(getTriangle(startPosition,3,5, 'NE', color));
    c.push(getTriangle(startPosition,2,5, 'NW', color));
    c.push(getParticle(startPosition,0,6, color));
    c.push(getParticle(startPosition,0,7, color));
    c.push(getParticle(startPosition,0,8, color));
    c.push(getParticle(startPosition,0,9, color));
    c.push(getParticle(startPosition,0,10, color));
    return c;
};

//Symbol 1
var getSymbol1Shape = function (startPosition, color) {
    var c = new Array();
    for (var i=1; i< 11; i++){
        c.push(getParticle(startPosition,0,i, color));
    }
    c.push(getTriangle(startPosition,0,9, 'SE', color));
    c.push(getTriangle(startPosition,-1,8, 'SE', color));
    c.push(getTriangle(startPosition,-3,8, 'SW', color));
    c.push(getParticle(startPosition,-1,10, color));
    c.push(getParticle(startPosition,-2,9, color));
    c.push(getTriangle(startPosition,-2,9, 'NW', color));
    c.push(getTriangle(startPosition,-3,8, 'NW', color));
    return c;
};

var getSymbol1Boundries = function (startPosition, context) {
    var array = new Array();
    array.push(getBoundryPoint(startPosition, 0, 0));
    array.push(getBoundryPoint(startPosition, 0, 9));
    array.push(getBoundryPoint(startPosition, -2, 7));
    array.push(getBoundryPoint(startPosition, -3, 8));
    array.push(getBoundryPoint(startPosition, -1, 10));
    array.push(getBoundryPoint(startPosition, 1, 10));
    array.push(getBoundryPoint(startPosition, 1, 0));

    DrawLetterBoundries(context,  array);
}
var getLetterCBoundries = function (startPosition, context) {
    var array = new Array();
    array.push(getBoundryPoint(startPosition, 3, 0));
    array.push(getBoundryPoint(startPosition, 1, 0));
    array.push(getBoundryPoint(startPosition, 0, 1));
    array.push(getBoundryPoint(startPosition, 0, 5));
    array.push(getBoundryPoint(startPosition, 1, 6));
    array.push(getBoundryPoint(startPosition, 3, 6));
    array.push(getBoundryPoint(startPosition, 3, 5));
    array.push(getBoundryPoint(startPosition, 1, 5));
    array.push(getBoundryPoint(startPosition, 1, 1));
    array.push(getBoundryPoint(startPosition, 3, 1));
    DrawLetterBoundries(context,  array);
}
var getLetterLBoundries = function (startPosition, context) {
    var array = new Array();
    array.push(getBoundryPoint(startPosition, 0, 0));
    array.push(getBoundryPoint(startPosition, 0, 10));
    array.push(getBoundryPoint(startPosition, 1, 10));
    array.push(getBoundryPoint(startPosition, 1, 0));
    DrawLetterBoundries(context,  array);
}
var getLetterIBoundries = function (startPosition, context) {
    var array = new Array();
    array.push(getBoundryPoint(startPosition, 0, 0));
    array.push(getBoundryPoint(startPosition, 0, 6));
    array.push(getBoundryPoint(startPosition, 1, 6));
    array.push(getBoundryPoint(startPosition, 1, 0));
    DrawLetterBoundries(context,  array);
}
var getLetterKBoundries = function (startPosition, context) {
    var array = new Array();
    array.push(getBoundryPoint(startPosition, 0, 0));
    array.push(getBoundryPoint(startPosition, 0, 10));
    array.push(getBoundryPoint(startPosition, 1, 10));
    array.push(getBoundryPoint(startPosition, 1, 4));
    array.push(getBoundryPoint(startPosition, 3, 6));
    array.push(getBoundryPoint(startPosition, 4, 5));
    array.push(getBoundryPoint(startPosition, 2, 3));
    array.push(getBoundryPoint(startPosition, 4, 1));
    array.push(getBoundryPoint(startPosition, 3, 0));
    array.push(getBoundryPoint(startPosition, 1, 2));
    array.push(getBoundryPoint(startPosition, 1, 0));
    DrawLetterBoundries(context,  array);
}
var getSymbol1Margins = function (startPosition, context) {
    var array = new Array();
    array.push(getBoundryPoint(startPosition, 0, 1));
    array.push(getBoundryPoint(startPosition, 1, 0));
    //DrawLetterBoundries(context, array)
    return array;
}
var getLetterCMargins = function (startPosition, context) {
    var array = new Array();
    array.push(getBoundryPoint(startPosition, 0, 6));
    array.push(getBoundryPoint(startPosition, 3, 0));
    //DrawLetterBoundries(context, array)
    return array;
}
var getLetterLMargins = function (startPosition, context) {
    var array = new Array();
    array.push(getBoundryPoint(startPosition, 0, 10));
    array.push(getBoundryPoint(startPosition, 2, 0));
    //DrawLetterBoundries(context, array)
    return array;
}
var getLetterIMargins = function (startPosition, context) {
    var array = new Array();
    array.push(getBoundryPoint(startPosition, 0, 6));
    array.push(getBoundryPoint(startPosition, 2, 0));
    //DrawLetterBoundries(context, array)
    return array;
}
var getLetterKMargins = function (startPosition, context) {
    var array = new Array();
    array.push(getBoundryPoint(startPosition, 0, 10));
    array.push(getBoundryPoint(startPosition, 5, 0));
    //DrawLetterBoundries(context, array);
    return array;
}
var getBoundryPoint = function (startPosition, multiplierX, multiplierY){
    return new Point(offsetX + startPosition + blockDefaultWidth * multiplierX, offsetY + Config.canvas1.yChange +10 - blockDefaultHeight * multiplierY);
}
function DrawLogoBoundries(context){
    getSymbol1Boundries(0, context);
    getLetterCBoundries(50, context);
    getLetterLBoundries(150, context);
    getLetterIBoundries(200, context);
    getLetterCBoundries(250, context);
    getLetterKBoundries(350, context);
}
function DrawLogoMargins(context){
    getSymbol1Margins(0, context);
    getLetterCMargins(50, context);
    getLetterLMargins(150, context);
    getLetterIMargins(200, context);
    getLetterCMargins(250, context);
    getLetterKMargins(350, context);
}
function DrawLetterBoundries(context, array)
{
    context.beginPath();
    for (var i=0; i < array.length; i++){
        if (i ==0){
            context.moveTo(array[i].x, array[i].y);
        }
        else{
            context.lineTo(array[i].x, array[i].y);
        }
    }
    context.closePath();
    context.stroke();
}

function GetLogoParticles (){
    var symbol1 = getSymbol1ShapeNew(0, 'rgb(218, 37, 29)');
    var letterC = getLetterCShapeNew(140, 'rgb(13, 79, 149)');
    var letterL = getLetterLShapeNew(250, 'rgb(13, 79, 149)');
    var letterI = getLetterIShapeNew(320, 'rgb(13, 79, 149)');
    var letterC2nd = getLetterCShapeNew(400, 'rgb(13, 79, 149)');
    var letterK = getLetterKShapeNew(510, 'rgb(13, 79, 149)');

    var logo = new Array();
    for (var i=0; i < 100; i++){
        if (symbol1.length > 0) {
            logo.push(symbol1[0]);
            symbol1.shift();
            if (i % 2 == 0 && symbol1.length > 0) {
                logo.push(symbol1[0]);
                symbol1.shift();
            }
        }
        if (letterC.length > 0){
            logo.push(letterC[0]);
            letterC.shift();
        }
        if (letterL.length > 0) {
            logo.push(letterL[0]);
            letterL.shift();
        }
        if (letterI.length > 0){
            logo.push(letterI[0]);
            letterI.shift();
        }
        if (letterC2nd.length > 0) {
            logo.push(letterC2nd[0]);
            letterC2nd.shift();
        }
        if (letterK.length > 0) {
            logo.push(letterK[0]);
            letterK.shift()
            if (i % 2 == 0 && letterK.length > 0) {
                logo.push(letterK[0]);
                letterK.shift()
            }
        }
    }
    return logo;
}