Config = new function() {
    this.canvas1Id = 'layer_1';
    this.canvas2Id = 'layer_2';
    this.canvas3Id = 'layer_3';
    this.canvas4Id = 'layer_4';
    this.canvas1 = new function() {
        this.animationSpeed = 33;
        this.particleVelocity = 100;
        this.yChange = 300;
    };
    this.canvas2 = new function() {
        this.animationSpeed = 25;
        this.particleVelocity = 1;
        this.startX = 400;  //Should be equal to canvas.width / 2
        this.startY = 600;
        this.endX = 400;    //Should be equal to canvas.width / 2
        this.endY = 460;
        this.factoryText = "f    a     c     t     o     r     y"; // TODO add spaces to fit with "1click"
        this.fillColor = "#000000";
        this.fontSize = 1;
        this.fontType = "Calibri bold italic";
        this.maxFontSize = 50;
        this.increaseFontSizeBy = 0.3;
        this.fontAlignment = "center";
        this.delayTime = 100;
    };
    this.canvas3 = new function() {
        this.animationSpeed = 20;
        this.particleVelocity = 2;
        this.startX = 1170;
        this.startY = 800;
        this.endX = 440;
        this.endY = 800;
        this.circleRadius = 15;
        this.fillColor =  "#00f";//"#0D4F95";
        this.globeImagePath = "images/globe_arrow/gaublys_transparent.png";
    };

    this.canvas4 = new function() {
        this.animationSpeed = 20;
        this.particleVelocity = 2;
        this.startX = 800;
        this.startY = 115;
        this.endX = 440
        this.endY = 100;
        this.circleRadius = 15;
        this.fillColor =  "#00f";//"#0D4F95";
        this.globeImagePath = "images/globe_arrow/rodykle.png";
        this.startArrorX = 695;
        this.startArrorY = 495;
    };
};