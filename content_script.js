// When the extension runs it has to check with the background script
// whether it is paused or not (because the content script can't check
// the localStorage directly)

chrome.runtime.sendMessage({name: "isPaused?"}, function (response) {

  // Check whether or not the extension is allowed to run

  if (response.value != 'true') {

    // First we specify a sketch object that will do all the stuff
    // to the canvas placed over the current page.

    var overlaySketch = function (p) {

      // This is the same thing as setup() but we're in 'instance' mode
      // so we use the 'p' in the front which is a reference to p5

      p.setup = function() {

        // We make the canvas and we put the result in a variable
        // so that we can change its CSS.

        // Notice how we have to write 'p.createCanvas()' instead of
        // just createCanvas(). That's because of this instance mode.

        overlayCanvas = p.createCanvas(p.windowWidth, p.windowHeight);

        // Now we set the CSS of this canvas we've added to the current
        // page.

        overlayCanvas.elt.style.position = 'fixed'; // Fixed position so it's always visible
        overlayCanvas.elt.style.left = '0'; // Aligned hard left
        overlayCanvas.elt.style.top = '0'; // and hard to the top
        overlayCanvas.elt.style["z-index"] = 1; // Floating over the top of the rest of the page
        overlayCanvas.elt.style["pointer-events"] = 'none'; // Not receiving pointer events

        // Note that depth 1 still means on some sites (like YouTube for example)
        // certain things will be 'higher' than your canvas, going over the top of it.
        // You could always try setting it higher.

        // Note we don't receive pointer events so that the user can still interact
        // with the actual page underneath our canvas. It's probably possible to do
        // both at the same time, but I haven't looked into it.

      };

      // This is the draw function, kind of obvious?

      p.draw = function() {

        // Here we're just going to set the background of this
        // sketch (i.e. its canvas) to clear so we can see through it
        // to the webpage underneath

        overlayCanvas.clear();

        // And draw a red circle on it, to prove we can draw things
        // on top of our page

        p.noStroke();
        p.fill(255,0,0);
        p.ellipse(p.mouseX, p.mouseY, 50, 50);

      };
    };

    // Finally, OUTSIDE the sketch, we actually instantiate the sketch
    // using p5 so that it starts running on the page.

    var overlaySketchInstance = new p5(overlaySketch);

  }

});
