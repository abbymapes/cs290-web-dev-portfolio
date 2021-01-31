/*
 * JavaScript file for my Portfolio
 *
 * @author Abby Mapes
 */

let canvas = document.getElementById('image-display');
let contentSection = document.getElementsByClassName('text-section')[0];
let canvasWidth = contentSection.clientWidth - 100;
let originalImage = null;
let filteredImage = null;
let scanPercent = 0.25;

/*
 * Loads and displays image from user input
 */
function loadImage() {
    originalImage = new SimpleImage(document.getElementById('fileInput'));
    originalImage.drawTo(canvas);
}

/*
 * Resizes image currently displayed to fit the width of the screen
 */
function resize() {
    canvasWidth = contentSection.clientWidth - 100;
    if (filteredImage != null) {
        var originalWidth = filteredImage.getWidth();
        var originalHeight = filteredImage.getHeight();
        var ratioFactor = canvasWidth / originalWidth;
        filteredImage.setSize(canvasWidth, originalHeight * ratioFactor);
        // Sets size of original image too, in case they clear the filter to see original
        originalImage.setSize(canvasWidth, originalHeight * ratioFactor);
        filteredImage.drawTo(canvas);
    } else if (originalImage != null) {
        var originalWidth = originalImage.getWidth();
        var originalHeight = originalImage.getHeight();
        var ratioFactor = canvasWidth / originalWidth;
        originalImage.setSize(canvasWidth, originalHeight * ratioFactor);
        originalImage.drawTo(canvas);
    } 
}

/*
 * Creates a new filtered scanning image and draws it to canvas 
 */
function scan() {
    if (originalImage != null) {
        filteredImage = new SimpleImage(originalImage.getWidth(), originalImage.getHeight());
        var horizontal = document.getElementById('horizontal').value;
        var vertical = document.getElementById('vertical').value;
        filterImage(originalImage, filteredImage, horizontal, vertical);
        filteredImage.drawTo(canvas);
    }
}

/*
 * Generates scan filter based on position of the slider to produce a scanning effect
 * with some degrees of randomness
 */
function filterImage(source, result, horizontal, vertical) {
    // Use to project slider position onto scanner position for picturee
    var horizontalRatio = horizontal / 255;
    var verticalRatio = (255 - vertical) / 255;
    // Use to generate element of randomness as slider changes
    var random = Math.random() * 10;
    // Combine randomness with color slider to generate different combinations
    var colorChanger = document.getElementById('color').value;
    scanPercent = document.getElementById('width').value / 100;
    var scanWidth = result.getWidth() * scanPercent;

    result.forEachPixel(pixel => {
        var srcPixel = source.getPixel(pixel.getX(), pixel.getY());
        if (Math.abs(pixel.getX() - Math.round(result.getWidth() * horizontalRatio)) <= scanWidth && 
        Math.abs(pixel.getY() - Math.round(result.getHeight() * verticalRatio)) <= scanWidth) {
            pixel.setRed(adjustValue(srcPixel.getRed(), horizontal));
            if (random > 5) {
                pixel.setGreen(adjustValue(srcPixel.getGreen(), colorChanger));
            } else {
                pixel.setBlue(adjustValue(srcPixel.getBlue(), colorChanger));
            }
        } else if (pixel.getX() - Math.round(result.getWidth() * horizontalRatio) <= 0 && 
        pixel.getY() - Math.round(result.getHeight() * verticalRatio) <= 0) {
            pixel.setBlue(adjustValue(srcPixel.getBlue(), horizontal));
            if (random > 5) {
                pixel.setRed(adjustValue(srcPixel.getRed(), colorChanger));
            } else {
                pixel.setGreen(adjustValue(srcPixel.getGreen(), colorChanger));
            }
        } else if (pixel.getX() - Math.round(result.getWidth() * horizontalRatio) >= 0 && 
        pixel.getY() - Math.round(result.getHeight() * verticalRatio) >= 0) {
            pixel.setGreen(adjustValue(srcPixel.getGreen(), horizontal));
            if (random > 5) {
                pixel.setBlue(adjustValue(srcPixel.getBlue(), colorChanger));
            } else {
                pixel.setRed(adjustValue(srcPixel.getRed(), colorChanger));
            }
        } else if (pixel.getX() - Math.round(result.getWidth() * horizontalRatio) <= 0 && 
        pixel.getY() - Math.round(result.getHeight() * verticalRatio) >= 0) {
            pixel.setGreen(adjustValue(srcPixel.getGreen(), horizontal));
            pixel.setRed(adjustValue(srcPixel.getRed(), horizontal));
            pixel.setAlpha(200);
            if (random > 5) {
                pixel.setBlue(adjustValue(srcPixel.getBlue(), colorChanger));
            } else {
                pixel.setGreen(adjustValue(srcPixel.getGreen(), colorChanger));
            }
        } else if (pixel.getX() - Math.round(result.getWidth() * horizontalRatio) >= 0 && 
        pixel.getY() - Math.round(result.getHeight() * verticalRatio) <= 0) {
            pixel.setGreen(adjustValue(srcPixel.getGreen(), horizontal));
            pixel.setRed(adjustValue(srcPixel.getRed(), horizontal));
            pixel.setBlue(adjustValue(srcPixel.getBlue(), horizontal));
            pixel.setAlpha(200);
            if (random > 5) {
                pixel.setBlue(adjustValue(srcPixel.getBlue(), colorChanger));
            } else {
                pixel.setRed(adjustValue(srcPixel.getRed(), colorChanger));
            }
        } 
    });
}

/*
 * Adjusts value based on threshold
 */
function adjustValue(value, threshold) {
    if (value < threshold) {
        return 255 - value;
    }
    else {
        return value;
    }
}

/*
 * Clears filter from image and displays original image
 */
function clearFilter() {
    if (originalImage != null) {
        filteredImage = null;
        originalImage.drawTo(canvas);
    }
}

/*
 * Erases image from canvas by drawing a reectange over it
 */
function clearCanvas() {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    originalImage = null;
    filteredImage = null;
}
