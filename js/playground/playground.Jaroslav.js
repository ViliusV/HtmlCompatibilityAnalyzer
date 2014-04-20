//items in array
var getCustomShape1 = function (startPosition, multiplierX, multiplierY, color){
    return new CustomShape1(new Point(offsetX + startPosition + blockDefaultWidth * multiplierX, offsetY - blockDefaultHeight * multiplierY),
        new Point(offsetX + startPosition + blockDefaultWidth * multiplierX, offsetY - blockDefaultHeight * multiplierY), color);
};
var getCustomShape2 = function (startPosition, multiplierX, multiplierY, direction, color){
    return new CustomShape2(new Point(offsetX + startPosition + blockDefaultWidth * multiplierX, offsetY - blockDefaultHeight * multiplierY),
        new Point(offsetX + startPosition + blockDefaultWidth * multiplierX, offsetY - blockDefaultHeight * multiplierY), direction, color);
};

//Symbol 1 new
var getSymbol1ShapeNew = function (startPosition, color) {
    var c = new Array();
    for (var i=1; i < 10; i++){
        for (var j=0; j< 3; j++){
            c.push(getParticle(startPosition, j, i, color));
        }
    }
    c.push(getParticle(startPosition, 1,10, color));
    c.push(getParticle(startPosition, 2,10, color));
    c.push(getParticle(startPosition, 2,11, color));
    c.push(getTriangle(startPosition, 0, 8, 'SE', color));
    c.push(getTriangle(startPosition, -1, 8, 'NW', color));
    c.push(getTriangle(startPosition, 0, 9, 'NW', color));
    c.push(getTriangle(startPosition, 1, 10, 'NW', color));
    c.push(getTriangle(startPosition, 2, 11, 'NW', color));
    return c;
};
//Letter L
var getLetterLShapeNew = function (startPosition, color) {
    var c = new Array();
    for (var i=1; i< 10; i++){
        for (var j=0; j< 2; j++){
            c.push(getParticle(startPosition, j, i, color));
        }
    }
    return c;
};

//Letter i
var getLetterIShapeNew = function (startPosition, color) {
    var c = new Array();
    for (var i=1; i< 6; i++){
        for (var j=0; j< 2; j++){
            c.push(getParticle(startPosition, j, i, color));
        }
    }
    c.push(getCustomShape1(startPosition, 0, 5, color));
    return c;
};

//Letter K
var getLetterKShapeNew = function (startPosition, color) {
    var c = new Array();
    c.push(getParticle(startPosition,4,1, color));
    c.push(getTriangle(startPosition,5,0, 'NE', color));
    c.push(getTriangle(startPosition,3,1, 'SW', color));
    c.push(getParticle(startPosition,0,1, color));
    c.push(getParticle(startPosition,1,1, color));
    c.push(getTriangle(startPosition,4,1, 'NE', color));
    c.push(getParticle(startPosition,3,2, color));
    c.push(getTriangle(startPosition,2,2, 'SW', color));
    c.push(getParticle(startPosition,0,2, color));
    c.push(getParticle(startPosition,1,2, color));
    c.push(getTriangle(startPosition,3,2, 'NE', color));
    c.push(getParticle(startPosition,2,3, color));
    c.push(getParticle(startPosition,0,3, color));
    c.push(getParticle(startPosition,1,3, color));
    c.push(getTriangle(startPosition,4,4, 'SE', color));
    c.push(getParticle(startPosition,2,4, color));
    c.push(getParticle(startPosition,0,4, color));
    c.push(getParticle(startPosition,1,4, color));
    c.push(getTriangle(startPosition,5,5, 'SE', color));
    c.push(getParticle(startPosition,3,5, color));
    c.push(getTriangle(startPosition,2,4, 'NW', color));
    c.push(getParticle(startPosition,0,5, color));
    c.push(getParticle(startPosition,1,5, color));
    c.push(getParticle(startPosition,4,6, color));
    c.push(getTriangle(startPosition,6,6, 'SE', color));
    c.push(getTriangle(startPosition,3,5, 'NW', color));
    c.push(getParticle(startPosition,0,6, color));
    c.push(getParticle(startPosition,1,6, color));
    c.push(getParticle(startPosition,0,7, color));
    c.push(getParticle(startPosition,1,7, color));
    c.push(getParticle(startPosition,0,8, color));
    c.push(getParticle(startPosition,1,8, color));
    c.push(getParticle(startPosition,0,9, color));
    c.push(getParticle(startPosition,1,9, color));
    return c;
};

//Letter C
var getLetterCShapeNew = function (startPosition, color) {
    var c = new Array();
    c.push(getCustomShape2(startPosition,3,0, 'SE', color));
    c.push(getCustomShape2(startPosition,0,2, 'SW', color));
    c.push(getParticle(startPosition,2,1, color));
    c.push(getParticle(startPosition,3,2, color));
    c.push(getParticle(startPosition,2,2, color));
    c.push(getParticle(startPosition,1,2, color));
    c.push(getParticle(startPosition,-0.5,3, color));
    c.push(getCurvedTriangle(startPosition,3,2, '', color));
    c.push(getCurvedTriangle(startPosition,2,3, 'NE', color));
    c.push(getParticle(startPosition,1,3, color));
    c.push(getParticle(startPosition,0,3, color));
    c.push(getCurvedTriangle(startPosition,3,4, 'SW', color));
    c.push(getCurvedTriangle(startPosition,3,4, 'SE', color));
    c.push(getParticle(startPosition,1,4, color));
    c.push(getParticle(startPosition,0,4, color));
    c.push(getParticle(startPosition,-0.5,4, color));
    c.push(getParticle(startPosition,3,5, color));
    c.push(getParticle(startPosition,2,5, color));
    c.push(getParticle(startPosition,1,5, color));
    c.push(getParticle(startPosition,2,6, color));
    c.push(getCustomShape2(startPosition,3, 6, 'NE', color));
    c.push(getCustomShape2(startPosition, 0, 4, '', color));
    return c;
};

function LoadChuckFact() {
    $.ajax({
        url: 'chuck/ChuckNorrisFacts50.htm',
        //type: "POST",
        dataType: "text",
        success: function (data) {
            var all = $(data).find('.item-list span.field-content a.createYourOwn').length;
            var random = Math.ceil(Math.random() * all);
            var selected = $(data).find('.item-list span.field-content a.createYourOwn')[random];
            $('p.fact-goes-here').html($(selected).text());
        }
    });
}
var soundFinish;
var soundGlobe;
var soundArrow;
$(document).ready(function() {
    soundFinish = $("#soundFinish").get(0);
    soundGlobe = $("#soundGlobe").get(0);
    soundArrow = $("#soundArrow").get(0);
});
var soundFinishPlay = function (){
    soundFinish.play();
};
var soundFinishPause = function (){
    soundFinish.pause();
};
var soundGlobePlay = function (){
    soundGlobe.play();
};
var soundGlobePause = function (){
    soundGlobe.pause();
};
var soundArrowPlay = function (){
    soundArrow.play();
};
var soundArrowPause = function (){
    soundArrow.pause();
};