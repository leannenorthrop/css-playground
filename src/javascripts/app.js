window.tfFrames = {
    generateFrames: function() {
        var body = document.getElementsByTagName("body")[0];
        // var frameStyles = document.getElementById("frame-styles");
        // body.removeChild(frameStyles);
        // frameStyles = document.createElement("style");
        // frameStyles.setAttribute("type", "text/css");
        // frameStyles.setAttribute("id", "frame-styles");
        // body.appendChild(frameStyles);
        var outputElement = document.getElementById("css");
        var framesElement = document.getElementsByClassName("frames")[0];
        var numberOfFrames = document.getElementById("frameCount").value;
        var frameClass = document.getElementById("frameClass").value;  
        var frameName = document.getElementById("frameName").value;      
        var i = 0;
        for (; i < numberOfFrames; ) { 
            var spanElement = document.createElement("span");
            spanElement.dataset.frameCount = i+1;
            spanElement.setAttribute("class", "opacity frame " + frameName + (i+1) + " " + frameClass);
            framesElement.appendChild(spanElement);

            // frameStyles.sheet.insertRule(".frame" + (i+1) + " { }", frameStyles.sheet.cssRules.length);
            outputElement.value = outputElement.value + "\n.frame." + frameName + (i+1) + " {\n}";
            i++;
        }
    },
    getFrame: function(frameNumber, name) {
        var found = undefined;
        var frameElements = document.querySelectorAll('[data-frame-count="' + frameNumber + '"]');
        var i = 0;
        for (; i < frameElements.length; ) {
            var classes = frameElements[i].className.split(' ');
            if (frameElements[i].dataset.frameCount == frameNumber &&
                classes.indexOf(name + frameNumber) >= 0) {
                found = frameElements[i];
                break;
            }
        }
        return found;
    },
    generateKeyframes: function() {
        var i = 0;
        var frameCount = 1;
        var numberOfFrames = document.getElementById("frameCount").value;
        var frameName = document.getElementById("frameName").value; 
        var outputElement = document.getElementById("css");
        var animationName = "hello";
        var animationCount = 0;
        var letters = ['a','b','c','d','e','f','g'];
        var keyframes = "@keyframes " + animationName + letters[animationCount] + " {\n";
        var animations = "";
        var last = 0;
        var stepCount = 1;
        
        for (; i < numberOfFrames; ) {
            var frame = this.getFrame(frameCount,frameName);
            if (frameCount % 25 == 0) {
                animations += animationName + letters[animationCount] + " 1s steps(24) 1 " + (animationCount) + "s normal, ";
                animationCount++;
                stepCount = 1;
                last = 0;
                keyframes += "}\n\n";
                keyframes += "@keyframes " + animationName + letters[animationCount] + " {\n";
            }
            var next = stepCount * 4.16;
            if (next > 99) {
                next = 100;
            }
            keyframes += "  " + last + "%," + next + "% {\n";
            keyframes += "    /* frame " + (i+1) + " rules here */";
            var styles = this.getStyle(".frame."+frameName + frameCount);
            if (styles != undefined) {
                keyframes += styles;    
            } 
            keyframes += "\n  }\n";
            last = next;

            stepCount++;
            frameCount++;
            i++;
        }
        outputElement.value = keyframes;

        outputElement.value = outputElement.value + "\n\n.animate {\n";
        outputElement.value = outputElement.value + "  animation: " + animations.substr(0, animations.length-2) + ";\n";
        outputElement.value = outputElement.value + "  animation-fill-mode: forwards;\n}\n\n";    
    },
    getStyle: function(className) {
        var found = undefined;
        //var classes = document.styleSheets[0].rules || document.styleSheets[0].cssRules;
        var frameStyles = document.getElementById("frame-styles");
        var classes = frameStyles.sheet.cssRules;
        for (var x = 0; x < classes.length; x++) {
            if (classes[x].selectorText == className) {
                found = classes[x].cssText ? classes[x].cssText : classes[x].style.cssText;
                found = found.substring(found.indexOf("{")+1, found.lastIndexOf("}"));
                break;
            }
        }
        return found;
    },
    toggle: function() {
        var tbtn = document.getElementById("tbtn");
        var form = document.getElementsByTagName("form")[0];
        var textarea = document.getElementsByTagName("textarea")[0];
        if (form.getAttribute("style") ==="display:none;") {
            form.setAttribute("style", "");
            textarea.setAttribute("style","");
        } else {
            form.setAttribute("style", "display:none;");
            textarea.setAttribute("style","display:none;");
        }
    },
    init: function() {
        var body = document.getElementsByTagName("body")[0];

        var tBtn = document.createElement("button");
        tBtn.setAttribute("type", "button");
        tBtn.setAttribute("id", "tbtn");
        tBtn.setAttribute("onclick", "window.tfFrames.toggle();");
        tBtn.appendChild(document.createTextNode("Hide >"));
        body.appendChild(tBtn);

        var form = document.createElement("form");
        var label = document.createElement("label");
        label.appendChild(document.createTextNode("Generate: "));
        form.appendChild(label);

        var number = document.createElement("input");
        number.setAttribute("type", "number");
        number.setAttribute("name", "genFrames");
        number.setAttribute("value", "50");
        number.setAttribute("id", "frameCount");
        form.appendChild(number);

        form.appendChild(document.createTextNode(" with class "));
        
        var clazz = document.createElement("input");
        clazz.setAttribute("type", "text");
        clazz.setAttribute("value", "");
        clazz.setAttribute("id", "frameClass");
        form.appendChild(clazz);

        form.appendChild(document.createTextNode(" with name "));

        var fName = document.createElement("input");
        fName.setAttribute("type", "text");
        fName.setAttribute("value", "");
        fName.setAttribute("id", "frameName");
        form.appendChild(fName);

        var goBtn = document.createElement("button");
        goBtn.setAttribute("type", "button");
        goBtn.setAttribute("onclick", "window.tfFrames.generateFrames();");
        goBtn.appendChild(document.createTextNode("Go >"));
        form.appendChild(goBtn);

        var genBtn = document.createElement("button");
        genBtn.setAttribute("type", "button");
        genBtn.setAttribute("onclick", "window.tfFrames.generateKeyframes();");
        genBtn.appendChild(document.createTextNode("Generate Keyframes >"));
        form.appendChild(genBtn);

        body.appendChild(form);

        var outputElement = document.createElement("textarea");
        outputElement.setAttribute("rows", "10");
        outputElement.setAttribute("cols", "100");
        outputElement.setAttribute("id", "css");
        body.appendChild(outputElement);

        var framesDiv = document.createElement("div");
        framesDiv.setAttribute("class", "frames");
        body.appendChild(framesDiv);
    } 
}