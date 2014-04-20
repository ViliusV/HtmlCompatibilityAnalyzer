var Logo = new function() {
    var canvas1;
    var canvas2;
    var canvas3;
    var canvas4;
    var context1;
    var context2;
    var context3;
    var context4;
    var playAnimation1 = true;
    var playAnimation2 = true;
    var playAnimation3 = true;
    var playAnimation4 = true;
    var canvasWidth;
    var canvasHeight;
    var mouseX;
    var mouseY;
    var fallback = false;
    var particles = new Array();// Array of all the particles of the main letters in word "1Click"
    var factoryBlock;           // Shape for containing "factory" word
    var blueCircle;             // Circle above the letter "I"
    var redArrow;
    var currentParticle = 0;
    var currentValueNo = 0;
    var startArror = true;
    var globeImageNonFlickering = null;

    // Main function - calls all other needed routines
    this.draw = function() {
        init();

        // Do not proceed if it's fallback mode
        if (fallback) {
            return;
        }

        // Setting up initial object values
        setUp1();
        setUp2();
        setUp3();
        setUp4();

        // Let the animation commence!
        animate1(context1);
        animate2(context2);
        animate3(context3);
        animate4(context4);
    };

    var init = function() {
        canvas1 = $('#' + Config.canvas1Id);
        canvas2 = $('#' + Config.canvas2Id);
        canvas3 = $('#' + Config.canvas3Id);
        canvas4 = $('#' + Config.canvas4Id);

        // Check if browser supports canvas 2D context
        try {
            context1 = canvas1.get(0).getContext('2d');
            context2 = canvas2.get(0).getContext('2d');
            context3 = canvas3.get(0).getContext('2d');
            context4 = canvas4.get(0).getContext('2d');
            loadGlobeAndArrowImages();
        } catch (err) {
            fallback = true;
        }

        // Size of all the canvases is the same so we set general size variables
        canvasWidth = canvas1.width();
        canvasHeight = canvas1.height();

        // Add mouse listeners
        $(window).mousemove(onMouseMove);
    };

    // Event handler for mouse movement
    var onMouseMove = function(e) {
        determineMouseCoords(e);

        if (!playAnimation1) {
            checkIfAnyLetterIsOvered();
        }
    };

    var determineMouseCoords = function(e) {
        var canvasOffset = canvas1.offset();
        mouseX = Math.floor(e.pageX - canvasOffset.left);
        mouseY = Math.floor(e.pageY - canvasOffset.top);
    };

    // Clears the canvas
    var clearCanvas = function(context) {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
    };

    // Setup objects for the animation 1
    var setUp1 = function() {
        particles = GetLogoParticles();
    };

    // Setup objects for the animation 2
    var setUp2 = function() {
        var startPoint = new Point(Config.canvas2.startX, Config.canvas2.startY);
        var endPoint = new Point(Config.canvas2.endX, Config.canvas2.endY);
        factoryBlock = new TextBox(startPoint, endPoint, Config.canvas2.factoryText, Config.canvas2.fillColor, Config.canvas2.fontSize, Config.canvas2.fontType);
    };

    // Setup objects for the animation 3
    var setUp3 = function() {
        var startPoint = new Point(Config.canvas3.startX - 300, Config.canvas3.startY);
        var endPoint = new Point(Config.canvas3.endX, Config.canvas3.endY);
        blueCircle = new Circle(startPoint, endPoint, Config.canvas3.circleRadius, Config.canvas3.fillColor);
        blueCircle.imagePath = Config.canvas3.globeImagePath;
        var startPointArrow = new Point(Config.canvas3.startArrorX, Config.canvas3.startArrorY);
        redArrow = new Arrow(startPointArrow, endPoint, Config.canvas3.circleRadius, Config.canvas3.fillColor);
    };

    var setUp4 = function() {
        var startPointArrow = new Point(Config.canvas4.startArrorX, Config.canvas4.startArrorY);
        var endPoint = new Point(Config.canvas4.endX, Config.canvas4.endY);
        redArrow = new Arrow(startPointArrow, endPoint, Config.canvas4.circleRadius, Config.canvas4.fillColor);
        redArrow.imagePath = Config.canvas4.globeImagePath;
    };

    // Animation of dropping letters
    var animate1 = function(context) {
        // Additional check to ensure that subsequent calls won't be executed
        if (!playAnimation1) {
            soundFinishPause();
            return;
        }

        clearCanvas(context);

        // Update logic goes here - update all your objects
        particles[currentParticle].move();
        if (currentParticle + 1 < particles.length)
            particles[currentParticle + 1].move();
        if (currentParticle + 2 < particles.length)
            particles[currentParticle + 2].move();

        if(particles[currentParticle].current.y >= (particles[currentParticle].end.y + Config.canvas1.yChange)) {
            currentParticle++;
            currentParticle++;
            currentParticle++;
        }
        else {
            soundFinishPlay();
        }

        //DrawLogoBoundries(context);
        DrawLogoMargins(context);

        // Drawing logic goes here
        for (var i = 0; i < currentParticle + 1 ; i++) {
            if (i < particles.length)
            {
                particles[i].draw(context);
            }
        }

        // Check whether the animation should continue
        if (currentParticle > particles.length - 1) {
            playAnimation1 = false;
            soundFinishPause();
        }

        // Set new animation call
        if (playAnimation1) {
            // Run the animation loop again in short time interval
            var tmp = function(){
                animate1(context);
            };
            setTimeout(tmp, Config.canvas1.animationSpeed);
        }
    };

    // Word "Factory" animation
    var animate2 = function(context) {
        // Additional check to ensure that subsequent calls won't be executed
        if (!playAnimation2) {
            return;
        }

        clearCanvas(context);
        if (playAnimation3 === false) {
            // Update logic goes here - update all your objects
            factoryBlock.move();
            // Drawing logic goes here
            factoryBlock.draw(context);
            // Check whether the animation should continue
            playAnimation2 = factoryBlock.shouldContinue();
        }
        // Set new animation call
        if (playAnimation2) {
            // Run the animation loop again in short time interval
            var tmp = function() {
                animate2(context);
            };
            setTimeout(tmp, Config.canvas2.animationSpeed);

        }
    };

    // Dot animation
    var animate3 = function(context) {

        // Additional check to ensure that subsequent calls won't be executed
        if (!playAnimation3) {
            soundGlobePause();
            return;
        }

        clearCanvas(context);
        if(playAnimation1 == false)
        {
            // Update logic goes here - update all your objects
            blueCircle.move();
//
//        // Drawing logic goes here
            blueCircle.draw(context);
//
//        // Check whether the animation should continue
            playAnimation3 = blueCircle.shouldContinue();
            if (playAnimation3)
                soundGlobePlay();
            else
                soundGlobePause();
        }
        // Set new animation call
        var tmp = null;
        if (playAnimation3) {
            // Run the animation loop again in short time interval
            tmp = function() {
                animate3(context);
            };
            setTimeout(tmp, Config.canvas3.animationSpeed);

        }
        else
        {
            if (tmp != null)
                clearTimeout(tmp);
        }
    };
    var animate4 = function(context) {
        // Additional check to ensure that subsequent calls won't be executed
        if (!playAnimation4) {
            return;
        }

        clearCanvas(context);

        //check if blueCircle stopped
        startArror = blueCircle.shouldContinue();

        if(startArror == false)
        {
            // Update logic goes here - update all your objects
            redArrow.move();
            // Drawing logic goes here
            redArrow.draw(context);
            soundArrowPlay();
        }
        // Check whether the animation should continue
        playAnimation4 = redArrow.shouldContinue();
        if (!playAnimation4)
            soundArrowPause();
        // Set new animation call
        var tmp = null;
        if (playAnimation4) {
            // Run the animation loop again in short time interval
            tmp = function() {
                animate4(context);
            };
            setTimeout(tmp, Config.canvas4.animationSpeed);
        }
        else
        {
            if (tmp != null)
                clearTimeout(tmp);
        }
    };
    // Checks if any letter is overed and according to that (don't) show 1CF value which is assigned to that particular letter
    var checkIfAnyLetterIsOvered = function() {
        for (var i = 0; i < 6; i++) {
            var boundaries = getBoundaries(i);

            if (mouseX >= boundaries[0].x && mouseX <= boundaries[1].x && mouseY >= boundaries[0].y && mouseY <= boundaries[1].y) {
                currentValueNo = i + 1;
                // Just to be sure: hide all popups except the current
                hideValuePopups(currentValueNo);
                // Then - show our current
                if (i == 5) {
                    LoadChuckFact();
                }
                showValuePopup(currentValueNo);
                return;
            }
        }
        // Hide all the popups
        hideValuePopups(-1);
    };

    var getBoundaries = function(index) {
        switch(index){
            case 0:
                return getLetterCMargins(140, context1);
            case 1:
                return getLetterLMargins(250, context1);
            case 2:
                return getLetterIMargins(320, context1);
            case 3:
                return getLetterCMargins(400, context1);
            case 4:
                return getLetterKMargins(510, context1);
            case 5:
                return getSymbol1Margins(0, context1);
        }
    };

    var showValuePopup = function(index) {
        var valueContainer = $('#value_' + index);
        valueContainer.css({ left: mouseX + 15 + 'px', top: mouseY + 15 + 'px' });
        valueContainer.show('fast');
    };

    var hideValuePopups = function(except) {
        for (var i = 1; i <= 6; i++) {
            if (except >= 0 && except == i) {
                continue;
            }
            $('#value_' + i).hide('fast');
        }
    };

    var loadGlobeAndArrowImages = function() {
        //Globe:
        var globeImage = $(".globe_image")[0];
        // Actual preloading
        var tmpGlobeImageObj = new Image();
        tmpGlobeImageObj.src = globeImage.src;
        $(tmpGlobeImageObj).load(function() {
            ;
        });
        //Arrow:
        var arrowImage = $(".arrow_image")[0];
        // Actual preloading
        var tmpArrowImageObj = new Image();
        tmpArrowImageObj.src = arrowImage.src;
        $(tmpArrowImageObj).load(function() {
            ;
        });
    };

};