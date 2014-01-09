/**
 * Spark
 *
 * Experiment by Ivailo Hristov( ivailo.nikolaev.hristov@gmail.com )
 *
 * 2012
 *
 */

(function(exports, document, requestAnimationFrame, undefined) {
    // Initializations
    //
    // ///////////////////////////// //
    //
    var
    // Get canvas and context
        spark = document.getElementById('spark'),
        ctx = spark.getContext('2d'),

    // Canvas dimensions
        width = spark.width,
        height = spark.height,

    // FPS counter vars
        fps = 0,
        now = +(new Date()),
        lastFpsShowTime = now,
        fpsElement = document.getElementById('fps'),

    // Color for fade effect( background color )
        FADE_COLOR = 'rgba(0, 0, 0, 0.08)',

    // Automatic shoot interval
        SHOT_INTERVAL = 300,

    // Multiple shots configurations
        MULTIPLE_SHOTS_INTERVAL = 20*1000,
        MULTIPLE_SHOTS_COUNT = 1,
        MULTIPLE_SHOTS_LENGTH = 50,
        MULTIPLE_SHOTS_DISTANCE = 1500,

    // How many shots should be pushed on click
        SHOTS_PER_CLICK = 10,

    // Steps for sparks and shots
        MAX_STEP_X = 2,
        MAX_STEP_Y = 2,

    // How many sparks can be produced on one explosion
        MIN_NUM_SPARKS = 40,
        MAX_NUM_SPARKS = 70,

    // Frames configurations
        MIN_NUM_SPARK_FRAMES = 5,
        MAX_NUM_SPARK_FRAMES = 35,

        MIN_NUM_SHOT_FRAMES = 40,
        MAX_NUM_SHOT_FRAMES = 60,

    // List of all animation buffers which
    // will be iterated during each frame
        bufferList = [];

    // Start shot intervals
    setInterval(function(){
        createShot();
    }, SHOT_INTERVAL );
    setInterval(function(){
        for( var i=-1, j=MULTIPLE_SHOTS_COUNT; ++i<j; ){
            setTimeout(function(){
                for( var k=-1, t=MULTIPLE_SHOTS_LENGTH; ++k<t; ){
                    createShot();
                }
            }, i*MULTIPLE_SHOTS_DISTANCE);
        }
    }, MULTIPLE_SHOTS_INTERVAL) ;

    // Start frame loop
    requestAnimationFrame(frame, ctx);

    // Create spark on click
    spark.addEventListener('click', function(){
        for( var i=-1, j=SHOTS_PER_CLICK; ++i<j; createShot() ){}
        return false;
    }, false);

    // Add exports( console is yours (; )
    exports.createShot = createShot;
    exports.createSpark = createSpark;

    // Functions
    //
    // ///////////////////////////// //
    //
    return;

    function createSpark(e, color, hold){
        var
        // Mouse position in canvas
            mouseX = e.offsetX !== undefined ? e.offsetX : e.layerX,
            mouseY = e.offsetY !== undefined ? e.offsetY : e.layerY,

            buffer = [],        // Buffer for all frames of all sparks

            i = -1, j = -1,     // Loops variables
            sx, sy,             // Will be used to generate random steps
            pX, pY,             // Transformations of frames progress for x and y

            p,                  // Will store current percent
            frames,             // Array of all frames for one spark


            nF,                 // Number of frames, that will be random for every spark

        // Generate random number of sparks
            nS = MIN_NUM_SPARKS + Math.ceil(Math.random() * MAX_NUM_SPARKS);

        for(; ++i < nS; ) {
            // Calculate steps
            sx = (Math.random() > 0.5 ? 1 : -1) * ( Math.random() * MAX_STEP_X + 0.1 );
            sy = (Math.random() > 0.5 ? 1 : -1) * ( Math.random() * MAX_STEP_Y + 0.1 );

            // Generate random number of frames
            nF = MIN_NUM_SPARK_FRAMES + Math.ceil(Math.random() * MAX_NUM_SPARK_FRAMES);

            // Create frames array for current spark
            frames = [];

            for(j = -1; ++j <= nF; ) {
                p = j / nF; // Frames progress

                // Calculate X and Y percents
                pX = easeIn(p);
                pY = easeIn(p);

                // Add frame
                frames.push([
                    mouseX + pX * sx * nF,
                    mouseY + pY * (sy + p) * nF, // Add current percent to step to produce fall down effect
                    1 - p*p*p                         // Set smaller alpha for each next frame
                ]);
            }
            // Add created spark in frames array
            buffer.push( frames );
        }

        // Each buffer has its own frames count,
        //  fillColor and number of frames
        buffer.frame = 0;
        buffer.fillStyle = color || getRandomColor();
        buffer.numFrames = MIN_NUM_SPARK_FRAMES + MAX_NUM_SPARK_FRAMES;

        // Start animation directly if spark is not holden
        if( !hold ) bufferList.push( buffer );

        return buffer;
    }
    function createShot( sx_, sy_, color_ ){
        var
            buffer = [],        // Buffer for shot frames
            j = -1,             // Loops variables

        // Start positions
            sx = Math.random() * width, // Start from random bottom point
            sy = height,

            pX, pY,             // Transforamtions of frames progress for x and y

        // End positions
            eX = sx_ !== undefined ? sx_ : width / 4 + Math.random() * width / 2,
            eY = sy_ !== undefined ? sy_ : height / 6 + Math.random() * height / 2,

        // Delta positions
            dX = eX - sx,
            dY = eY - sy,

        // Shoot and its spark color
            color = color_ || getRandomColor(),

            p,                  // Will store current percent
            frames = [],        // Array for shot frames

        // Generate random number of frames
            nF = MIN_NUM_SHOT_FRAMES + Math.ceil(Math.random() * MAX_NUM_SHOT_FRAMES),

        // Create spark buffer here, not in frame loop.
        // This should allow browser to produce more frames.
            spark = createSpark({
                offsetX: eX,
                offsetY: eY
            }, color, true);

        for(j = -1; ++j < nF; ) {
            p = j / nF; // Frames progress

            // Calculate X and Y percents( using linear easing for now ... )
            pX = (p);
            pY = (p);

            frames.push([
                sx + pX * dX,
                sy + pY * dY,
                1
            ]);
        }

        buffer.push( frames );

        buffer.frame = 0;
        buffer.fillStyle = color;
        buffer.numFrames = nF;
        buffer.callback = function(){
            // Start spark animation immediately after shot animation end
            bufferList.push(spark);
        };

        // Start shot animation
        bufferList.push(buffer);
    }

    function frame(){
        requestAnimationFrame(frame, ctx);
        processFps();

        // Fade effect
        ctx.fillStyle = FADE_COLOR;
        ctx.fillRect(0, 0, width, height);

        // Loop trough bufferList and produce one frame for each
        //  frame list in each buffer
        if(bufferList.length) {
            var i, j, f, buffer, frames;

            for(i = -1; (buffer = bufferList[++i]); ) {
                for(j = -1, f = buffer.frame; (frames = buffer[++j]); ) {
                    frames[f] && drawElement(frames[f][0], frames[f][1], buffer.fillStyle, frames[f][2]);
                }

                // if this is buffer last frame, remove buffer
                if(++buffer.frame === buffer.numFrames) {
                    bufferList.splice(i, 1);

                    // Do not skip next buffer, after delete
                    i -= 1;

                    // Call buffer callback if there is any
                    if(buffer.callback) buffer.callback();
                }
            }
        }

    }

    // Drawing function for sparks and shots 
    function drawElement(x, y, color, alpha) {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
    }

    // Random color generator
    function getRandomColor() {
        return "#" + ((1 << 24) * Math.random() | 0).toString(16);
    }

    // Easing
    function easeIn(pos) {
        return 1 - Math.pow(1 - pos, 2);
    }
    function easeOut(pos) {
        return Math.pow( pos, 3 );
    }

    // FPS counter
    function processFps() {
        if(((now = +(new Date())) - lastFpsShowTime) > 1000) {
            fpsElement.innerHTML = fps;

            fps = 0;
            lastFpsShowTime = now;
        }

        fps++;
    }
})(
    // Globals
    window, document,

    // Get supported requestAnimationFrame method
    window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||

        // Fallback with 60fps
        function(callback) {
            setTimeout(callback, 60);
        }
);