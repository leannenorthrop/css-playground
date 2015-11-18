window.tfFrames = {
    loadFrames: function() {
        var outputElement = document.getElementById("css");
        var data = outputElement.value;
        var lines = data.split("\n");

        var frameName = lines[0].split("|")[0];
        document.getElementById("frameCount").value = lines.length;
        document.getElementById("frameClass").value = "unknown";
        document.getElementById("frameName").value = frameName;
        this.generateFrames();

        for (var i = 0; i < lines.length; i++) {
            var parts = lines[i].split("|");
            if (parts.length >= 3) {
                var frame = this.getFrame(parts[1], parts[0]);
                frame.setAttribute("style",parts[2]);
            }
        }
    },
    generateFrames: function() {
        var body = document.getElementsByTagName("body")[0];
        var outputElement = document.getElementById("css");
        var framesElement = document.getElementsByClassName("frames")[0];
        var numberOfFrames = document.getElementById("frameCount").value;
        var frameClass = document.getElementById("frameClass").value;  
        var frameName = document.getElementById("frameName").value;     
        var selectElement = document.getElementsByTagName("select")[0]; 
        selectElement.dataset.frameName = frameName;
        document.getElementById("frameName2").value = frameName;
        var i = 0;
        var j = framesElement.childElementCount;
        for (; i < numberOfFrames; ) { 
            var spanElement = document.createElement("span");
            spanElement.dataset.frameCount = j+1;
            spanElement.dataset.frameLength = 1;
            spanElement.setAttribute("class", "opacity frame " + frameName + (j+1) + " " + frameClass);
            spanElement.setAttribute("style", "");
            framesElement.appendChild(spanElement);

            var optionElement = document.createElement("option");
            optionElement.setAttribute("value", (j+1));
            optionElement.innerHTML = frameName + (j+1);
            selectElement.appendChild(optionElement);
            //outputElement.value = outputElement.value + "\n.frame." + frameName + (i+1) + " {\n}";
            i++;
            j++;
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
        var animationName = frameName;
        var animationCount = 0;
        var letters = ['a','b','c','d','e','f','g'];
        var keyframes = "@keyframes " + animationName + "_" + animationCount + " {\n";
        var animations = animationName + "_" + animationCount + " 1s steps(24) 1 " + (animationCount) + "s normal, ";
        var last = 0;
        var stepCount = 1;
        var frameData = "/* Frame Data: \n";
        for (; i < numberOfFrames; ) {
            var frame = this.getFrame(frameCount,frameName);
            if (frameCount % 25 == 0) {
                animations += animationName + "_" + animationCount + " 1s steps(24) 1 " + (animationCount) + "s normal, ";
                animationCount++;
                stepCount = 1;
                last = 0;
                keyframes += "}\n\n";
                keyframes += "@keyframes " + animationName + "_" + animationCount + " {\n";
            }
            var next = stepCount * 4.16;
            if (next > 99) {
                next = 100;
            }
            keyframes += "  " + last + "%," + next + "% {\n";
            keyframes += "    /* frame " + (i+1) + " rules here */";
            var styles = this.getStyle(frameCount,frameName);
            if (styles != undefined) {
                keyframes += styles;  
                frameData += frameName + "|" + frameCount + "|" + styles + "\n";  
            } 
            keyframes += "\n  }\n";
            last = next;

            stepCount++;
            frameCount++;
            i++;
        }
        outputElement.value = "";
        outputElement.value = outputElement.value + "\n\n.animate {\n";
        outputElement.value = outputElement.value + "  animation: " + animations.substr(0, animations.length-2) + ";\n";
        outputElement.value = outputElement.value + "  animation-fill-mode: forwards;\n}\n\n";    

        outputElement.value = outputElement.value + keyframes;
        outputElement.value = outputElement.value + frameData + "*/\n";
    },
    getStyle: function(frameNumber, name) {
        var frame = this.getFrame(frameNumber, name);
        return frame.getAttribute("style");
    },
    selectFrame: function() {
        var selectElement = document.getElementsByTagName("select")[0];
        var frame = this.getFrame(selectElement.value, selectElement.dataset.frameName);
        var style = frame.getAttribute("style");
        var frameStyle = document.getElementById("frameStyle");
        frameStyle.value = style;
        console.log(frame);
    },
    setFrameStyle: function() {
        var selectElement = document.getElementsByTagName("select")[0];
        var frame = this.getFrame(selectElement.value, selectElement.dataset.frameName);
        var style = frame.getAttribute("style");
        var frameStyle = document.getElementById("frameStyle");
        frame.setAttribute("style", frameStyle.value);
        console.log(frame);
    },
    toggle: function() {
        var tbtn = document.getElementById("tbtn");
        var form = document.getElementsByTagName("form")[0];
        var textarea = document.getElementsByTagName("textarea")[0];
        var body = document.getElementsByTagName("body")[0];
        var framesElement = document.getElementsByClassName("frames")[0];
        if (form.getAttribute("style") ==="display:none;") {
            form.setAttribute("style", "");
            textarea.setAttribute("style","");
            framesElement.setAttribute("style","");
            body.className += "grid";
            tbtn.innerHTML = "Hide >";
        } else {
            form.setAttribute("style", "display:none;");
            textarea.setAttribute("style","display:none;");
            framesElement.setAttribute("style","display:none;");
            body.className = body.className.replace( /(?:^|\s)grid(?!\S)/g , '' );
            tbtn.innerHTML = "Show >";
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

        var listElement = document.createElement("ol");
        var step1Element = document.createElement("li");
        listElement.appendChild(step1Element);
        var step1PElement = document.createElement("p");
        step1PElement.appendChild(document.createTextNode("Paste previously generated frame data into textarea below and "));
        var loadBtn = document.createElement("button");
        loadBtn.setAttribute("type", "button");
        loadBtn.setAttribute("onclick", "window.tfFrames.loadFrames();");
        loadBtn.appendChild(document.createTextNode("Load"));
        step1PElement.appendChild(loadBtn);
        step1Element.appendChild(step1PElement);
        
        var step2Element = document.createElement("li");
        listElement.appendChild(step2Element);
        var step2PElement = document.createElement("p");
        var label = document.createElement("label");
        label.appendChild(document.createTextNode("If frames not loaded in step 1, generate: "));
        step2PElement.appendChild(label);

        var number = document.createElement("input");
        number.setAttribute("type", "number");
        number.setAttribute("name", "genFrames");
        number.setAttribute("value", "50");
        number.setAttribute("id", "frameCount");
        step2PElement.appendChild(number);

        step2PElement.appendChild(document.createTextNode(" frames with class "));
        
        var clazz = document.createElement("input");
        clazz.setAttribute("type", "text");
        clazz.setAttribute("value", "");
        clazz.setAttribute("id", "frameClass");
        step2PElement.appendChild(clazz);

        step2PElement.appendChild(document.createTextNode(" with name "));

        var fName = document.createElement("input");
        fName.setAttribute("type", "text");
        fName.setAttribute("value", "");
        fName.setAttribute("id", "frameName");
        step2PElement.appendChild(fName);

        var goBtn = document.createElement("button");
        goBtn.setAttribute("type", "button");
        goBtn.setAttribute("onclick", "window.tfFrames.generateFrames();");
        goBtn.appendChild(document.createTextNode("Go >"));
        step2PElement.appendChild(goBtn);
        step2Element.appendChild(step2PElement);


        var step3Element = document.createElement("li");
        listElement.appendChild(step3Element);
        var step3PElement = document.createElement("p");
        step3PElement.appendChild(document.createTextNode("Select "));
        var selectFrame = document.createElement("select");
        selectFrame.setAttribute("name", "frame");
        selectFrame.setAttribute("onchange", "window.tfFrames.selectFrame();");
        step3PElement.appendChild(selectFrame);
        step3PElement.appendChild(document.createTextNode(" frame and set style to "));
        var frameStyle = document.createElement("input");
        frameStyle.setAttribute("type", "text");
        frameStyle.setAttribute("value", "");
        frameStyle.setAttribute("id", "frameStyle");
        frameStyle.setAttribute("style", "width:500px;");
        frameStyle.setAttribute("onchange", "window.tfFrames.setFrameStyle();");
        step3PElement.appendChild(frameStyle);
        step3Element.appendChild(step3PElement);

        var step4Element = document.createElement("li");
        listElement.appendChild(step4Element);
        var step4PElement = document.createElement("p");
        step4PElement.appendChild(document.createTextNode("Use "));
        var fName2 = document.createElement("input");
        fName2.setAttribute("type", "text");
        fName2.setAttribute("value", "");
        fName2.setAttribute("id", "frameName2");
        step4PElement.appendChild(fName2);
        step4PElement.appendChild(document.createTextNode(" frames and "));
        var genBtn = document.createElement("button");
        genBtn.setAttribute("type", "button");
        genBtn.setAttribute("onclick", "window.tfFrames.generateKeyframes();");
        genBtn.appendChild(document.createTextNode("Generate Keyframes >"));
        step4PElement.appendChild(genBtn);
        step4Element.appendChild(step4PElement);

        form.appendChild(listElement);
        body.appendChild(form);

        var outputElement = document.createElement("textarea");
        outputElement.setAttribute("rows", "10");
        outputElement.setAttribute("cols", "100");
        outputElement.setAttribute("id", "css");
        body.appendChild(outputElement);

        var framesDiv = document.createElement("div");
        framesDiv.setAttribute("class", "frames");
        body.appendChild(framesDiv);

        this.toggle();
    } 
}