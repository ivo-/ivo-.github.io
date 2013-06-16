/**
 * Twister
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
        twister = document.getElementById('twister'),
        ctx = twister.getContext('2d'),

        width = twister.width,
        height = twister.height,

    // Dimensions of twisted image, it is possible to set them onLoad
        iWidth = 0,
        iHeight = 0,

    // FPS counter settings
        fps = 0,
        now = +(new Date()),
        lastFpsShowTime = now,
        fpsElement = document.getElementById('fps'),

    // Tiles array
        tiles = [],

    // Direction should be positive and negative consequently
        lastTickDirection = 1,

    // Image that should be twisted
        image = 'chrome-icon.png',

    // Color that will be used as a background and for fade effect
        FADE_COLOR = 'rgba(255, 238, 210, 0.3)',

    // Mouse positions
        mouseX = width / 2,
        mouseY = height / 2,

    // Steps
        STEP_X = 0.4,
        STEP_Y = 0.4,

    // Velocities
        START_VELOCITY_X = 2.4,
        START_VELOCITY_Y = 2.4,
        MAX_EXPLODE_VELOCITY = 40,

    // Rows and cols to split image
        ROWS = 41,
        COLS = 41,

    // All particles number
        PARTICLES = ROWS * COLS,

    // Friction on wrong direction
        FRICTION = 1.1,

    // How strong particles should be pulled into
    // their positions when they are in gravity area
        GRAVITY = 1.2,

    // If particles goes in this area its
    // velocity is reduced by gravity
        GRAVITY_AREA = 2,

    // Limit of tails drawn per frame
        TILES_LIMIT = -1,

    // Whether or not to pre-render each part of the
    //  image using offScreen canvas or to work with whole image
        USE_PRE_RENDER = window.location.hash === '#pre-render';

    // Pre-load twisted image and create tiles
    //
    (function( imgElement ){
        imgElement.onload = function(){
            var
            // Width and Height of each tile
                w = (iWidth = this.width)/COLS,
                h = (iHeight = this.height)/ROWS,

            // Loop variables
                i, j,

            // Current tile coordinates
                x, y,

            // Canvas and context
                c, cc,

            // Choose between pre-rendered and not pre-rendered
                addTile = USE_PRE_RENDER ? addPreRenderedTile : addNotPreRenderedTile;

            for( i=-1; ++i<COLS; ){
                for( j=-1; ++j<ROWS; ){
                    addTile();
                }
            }

            // Start game cycle after init
            //
            requestAnimationFrame(frame, ctx);

            // Add tile functions
            //
            function addPreRenderedTile(){
                c = document.createElement('canvas');
                cc = c.getContext('2d');

                c.width = w;
                c.height = h;

                x = i * w;
                y = j * h;

                cc.drawImage( imgElement, x, y, w, h, 0, 0, w, h );
                tiles.push( getTile( c, x, y, w, h ) );
            }
            function addNotPreRenderedTile(){
                x = i * w;
                y = j * h;

                tiles.push( getTile( imgElement, x, y, w, h ) );
            }
        };
        imgElement.src = image;
    })( document.createElement('img') );

    // Event listeners
    twister.addEventListener('mousemove', mouseMove, false);
    twister.addEventListener('click', explode, false);

    // Show particles number
    document.addEventListener('DOMContentLoaded', function(){
        document.getElementById('particles').innerHTML = PARTICLES;
    }, false );

    // Set limit of tails drawn per frame
    exports.setLimit = function( n ){
        TILES_LIMIT = n;
    };

    // Functions
    //
    // ///////////////////////////// //
    //
    function getTile( c, oX, oY, w ,h ){
        return {
            // Coordinates
            x: Math.random() * width,
            y: Math.random() * height,

            // Dimensions
            w: w,
            h: h,

            // Where to slice image(if it is not per-rendered)
            sX: oX,
            sY: oY,

            // Target positions
            targetX: (width - iWidth) / 2 + oX,
            targetY: (height - iHeight) / 2 + oY,

            // Offset to target position
            offsetX: oX,
            offsetY: oY,

            // Velocities
            velocityX: START_VELOCITY_X,
            velocityY: START_VELOCITY_Y,

            // Image or Canvas
            img: c
        };
    }

    function step( tile ){
        if( Math.abs(tile.x - tile.targetX) < GRAVITY_AREA ){
            tile.x = tile.targetX;
            tile.velocityX /= GRAVITY;
        }

        if( tile.x < tile.targetX ){
            tile.velocityX += STEP_X;
            if( tile.velocityX < 0 ) tile.velocityX /=FRICTION;
        } else if( tile.x > tile.targetX ){
            if( tile.velocityX > 0 ) tile.velocityX /=FRICTION;
            tile.velocityX -= STEP_X;
        }

        if( Math.abs(tile.y - tile.targetY) < GRAVITY_AREA ){
            tile.y = tile.targetY;
            tile.velocityY /= GRAVITY;
        }

        if( tile.y < tile.targetY ){
            tile.velocityY += STEP_Y;
            if( tile.velocityY < 0 ) tile.velocityY /=FRICTION;
        } else if( tile.y > tile.targetY ){
            tile.velocityY -= STEP_Y;
            if( tile.velocityY > 0 ) tile.velocityY /=FRICTION;
        }

        tile.x += tile.velocityX;
        tile.y += tile.velocityY;
    }

    function frame() {
        requestAnimationFrame( frame, twister );
        processFps();

        // Fade effect
        ctx.fillStyle = FADE_COLOR;
        ctx.fillRect(0, 0, width, height);

        for(var i = -1, tile; (tile = tiles[++i]); ) {
            if( i == TILES_LIMIT ) break;

            step( tile );
            drawTile( tile );
        }

        // Make it tickle, by simulation of mouse move
        // on each frame that will keep particles moving.
        //
        lastTickDirection *= -1;
        mouseMove.call( twister, {
            // Simulate mouse event
            offsetX: mouseX + lastTickDirection,
            offsetY: mouseY + lastTickDirection
        });
    }
    function drawTile( tile ){
        // NOTE: prevent anti-aliasing in both ways
        //
        if( USE_PRE_RENDER ){
            ctx.drawImage( tile.img, (0.5 + tile.x) << 0, (0.5 + tile.y) << 0, tile.w, tile.h );
        } else {
            ctx.drawImage( tile.img, tile.sX, tile.sY, tile.w, tile.h, (0.5 + tile.x) << 0, (0.5 + tile.y) << 0, tile.w, tile.h );
        }
    }

    function mouseMove(e){
        var i, tile;

        mouseX = e.offsetX !== undefined ? e.offsetX : e.layerX;
        mouseY = e.offsetY !== undefined ? e.offsetY : e.layerY;

        for(i = -1; (tile = tiles[++i]); ) {
            tile.targetX = mouseX - iWidth/2 + tile.offsetX;
            tile.targetY = mouseY - iHeight/2 + tile.offsetY;

            tile.velocityX += (Math.random() > 0.5 ? -1 : 1) * Math.random();
            tile.velocityY += (Math.random() > 0.5 ? -1 : 1) * Math.random();
        }
    }

    function explode(e){
        mouseX = e.offsetX !== undefined ? e.offsetX : e.layerX;
        mouseY = e.offsetY !== undefined ? e.offsetY : e.layerY;

        for(var i = -1, tile; (tile = tiles[++i]); ) {
            tile.velocityX += (Math.random() > 0.5 ? -1 : 1) * Math.random() * MAX_EXPLODE_VELOCITY;
            tile.velocityY += (Math.random() > 0.5 ? -1 : 1) * Math.random() * MAX_EXPLODE_VELOCITY;
        }
    }

    // Fps counter
    function processFps(){
        if( ((now = +(new Date())) - lastFpsShowTime) > 1000 ){
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