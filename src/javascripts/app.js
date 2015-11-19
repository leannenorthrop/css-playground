window.tfFrames = {
    loadFrames: function() {
        var outputElement = this.output;
        var data = outputElement.value;
        var lines = data.split("\n");

        var frameName = lines[0].split("|")[1];
        var frameClass = lines[0].split("|")[0];
        this.frameCount.value = lines.length;
        this.frameClass.value = frameClass;
        this.frameName.value = frameName;
        this.generateFrames();

        for (var i = 0; i < lines.length; i++) {
            var parts = lines[i].split("|");
            if (parts.length >= 5) {
                var frame = this.getFrame(parts[2], parts[1]);
                frame.dataset.frameExposureCount = parts[3];
                frame.setAttribute("style",parts[4]);
            }
        }
    },
    generateFrames: function() {
        var body = this.body;
        var outputElement = this.output;
        var framesElement = this.framesDiv;
        var numberOfFrames = this.frameCount.value;
        var frameClass = this.frameClass.value;  
        var frameName = this.frameName.value;     
        var selectElement = this.selectFrame; 
        selectElement.dataset.frameName = frameName;
        this.frameName2.value = frameName;
        var i = 0;
        var j = framesElement.childElementCount;
        for (; i < numberOfFrames; ) { 
            var spanElement = document.createElement("span");
            spanElement.dataset.frameCount = j+1;
            spanElement.dataset.frameExposureCount = 1;

            if (i == 0) {
                spanElement.setAttribute("class", "opaque frame " + frameName + (j+1) + " " + frameClass);
            } else {
                spanElement.setAttribute("class", "ghost frame " + frameName + (j+1) + " " + frameClass);
            }
            
            spanElement.setAttribute("style", "");
            framesElement.appendChild(spanElement);

            var optionElement = document.createElement("option");
            optionElement.setAttribute("value", (j+1));
            optionElement.innerHTML = frameName + (j+1);
            selectElement.appendChild(optionElement);
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
    _keyFrames: function(addComments) {
        var i = 0;
        var frameCount = 1;
        var numberOfFrames = this.frameCount.value;
        var frameName = this.frameName.value; 
        var frameClass = this.frameClass.value;
        var animationName = frameName;
        var animationCount = 0;
        var keyframes = "@keyframes " + animationName + "_" + animationCount + " {\n";
        var animations = animationName + "_" + animationCount + " 1s steps(24) 1 " + (animationCount) + "s normal, ";
        var last = 0;
        var stepCount = 1;
        var frameData = "/* Frame Data: \n";
        for (; i < numberOfFrames; ) {
            var frame = this.getFrame(frameCount,frameName);
            var duration = (frame.dataset.frameExposureCount * 4.16);

            if ((last+duration) > 100) {
                // Handle frame exposure across boundaries
                var d = 0;
                for (var k = 1; k <= frame.dataset.frameExposureCount; k++) {
                    d = (k * 4.16);
                    if ((last+d) > 100) {
                        break;
                    }
                }
                d--;
                duration = duration - d;
                var n = last + (d * 4.16);
                if (n > 99) {
                    n = 100;
                }
                keyframes += "  " + last + "%," + n + "% {";

                if (addComments) {
                    keyframes += "    /* frame " + (i+1) + " rules here */";
                }

                var styles = this.getStyle(frameCount,frameName);
                if (styles != undefined) {
                    keyframes += styles;  
                    frameData += frameClass + "|" + frameName + "|" + frameCount + "|" + styles + "\n";  
                } 
                keyframes += "}\n";

                // Next animation of 1s
                animations += animationName + "_" + animationCount + " 1s steps(24) 1 " + (animationCount) + "s normal, ";
                animationCount++;
                stepCount = 1;
                last = 0;
                keyframes += "}\n\n";
                keyframes += "@keyframes " + animationName + "_" + animationCount + " {\n";
            }
            
            var next = last + duration;
            if (next > 99) {
                next = 100;
            }
            keyframes += "  " + last + "%," + next + "% {";

            if (addComments) {
                keyframes += "    /* frame " + (i+1) + " rules here */";
            }

            var styles = this.getStyle(frameCount,frameName);
            if (styles != undefined) {
                keyframes += styles;  
                frameData += frameClass + "|" + frameName + "|" + frameCount + "|" + frame.dataset.frameExposureCount + "|" + styles + "\n";  
            } 
            keyframes += "}\n";
            last = next;

            stepCount++;
            frameCount++;
            i++;
        }
        keyframes += "}\n\n"; 
        return {'animations': animations.substr(0, animations.length-2), 'keyframes': keyframes, 'frameData': frameData};
    },
    generateKeyframes: function() {
        var css = this._keyFrames(true);
        var outputElement = this.output;
        var frameName = this.frameName.value; 
        outputElement.value = "";
        outputElement.value = outputElement.value + "." + frameName + ".animate {\n";
        outputElement.value = outputElement.value + "  animation: " + css.animations + ";\n";
        outputElement.value = outputElement.value + "  animation-fill-mode: forwards;\n}\n\n";    

        outputElement.value = outputElement.value + css.keyframes;
        outputElement.value = outputElement.value + css.frameData + "*/\n";
    },
    getStyle: function(frameNumber, name) {
        var frame = this.getFrame(frameNumber, name);
        return frame.getAttribute("style");
    },
    changeSelectFrame: function() {
        var f = document.getElementsByClassName("opaque").length > 0 ? document.getElementsByClassName("opaque")[0] : undefined;
        if (f != undefined){
            f.className = f.className.replace( /(?:^|\s)opaque(?!\S)/g , 'ghost');
        }

        var selectElement = this.selectFrame;
        var frame = this.getFrame(selectElement.value, selectElement.dataset.frameName);
        frame.className = frame.className.replace( /(?:^|\s)ghost(?!\S)/g , 'opaque');
        var style = frame.getAttribute("style");
        this.frameStyle.value = style;
        this.exposureCount.value = frame.dataset.frameExposureCount;
        

        console.log(frame);
        return true;
    },
    setFrameStyle: function() {
        var selectElement = this.selectFrame;
        var frame = this.getFrame(selectElement.value, selectElement.dataset.frameName);
        var style = frame.getAttribute("style");
        var frameStyle = this.frameStyle;
        frame.setAttribute("style", frameStyle.value);
        console.log(frame);
        return true;
    },
    setFrameExposureCount: function() {
        var selectElement = this.selectFrame;
        var frame = this.getFrame(selectElement.value, selectElement.dataset.frameName);
        frame.dataset.frameExposureCount = this.exposureCount.value;
        console.log(frame);
        return true;
    },
    toggle: function() {
        var tbtn = this.toggleBtn;
        var form = this.form;
        var textarea = this.output;
        var body = this.body;
        var framesElement = this.framesDiv;
        if (form.getAttribute("style") ==="display:none;") {
            this.clearTest();
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
    clearTest: function() {
        var aniName = this.nameElement.value;
        var e1 = document.getElementById(aniName+"Test");
        if (e1 != undefined) {
            e1.parentNode.removeChild(e1);
        }

        var s1 = document.getElementById(aniName + "Test");
        if (s1 != undefined) {
            s1.parentNode.removeChild(s1);
        }
    },
    test: function() {
        this.clearTest();
        var aniName = this.nameElement.value;
        var name = this.frameName.value;
        var frameClass = this.frameClass.value;  
        var frame = this.getFrame(1, name);
        var test = document.createElement("span");
        test.setAttribute("id", aniName+"Test");
        var body = this.body;
        body.appendChild(test);

        var stylesheet = document.createElement("style");
        stylesheet.setAttribute("id", aniName + "Test");
        stylesheet.appendChild(document.createTextNode(""));
        body.appendChild(stylesheet);

        var css = this._keyFrames(false);
        console.log(css.keyframes);
        var keyframes = css.keyframes.split("\n\n");
        console.log(keyframes);
        for (var i = 0; i < keyframes.length; i++) {
            if (keyframes[i].length > 0) {
                stylesheet.sheet.insertRule(keyframes[i], i);
            }
        }
        
        stylesheet.sheet.insertRule("." + name + ".animate {animation: " + css.animations + ";animation-fill-mode: forwards;}", 1);
        console.log(stylesheet.sheet.cssRules);
        test.className = frameClass + " " + name + " animate";

        var form = document.getElementsByTagName("form")[0];
        if (form.getAttribute("style") ==="display:none;") {
        } else {
            this.toggle();    
        }
    },
    init: function() {
        var body = document.getElementsByTagName("body")[0];
        this.body = body;

        var toggleBtn = document.createElement("button");
        toggleBtn.setAttribute("type", "button");
        toggleBtn.setAttribute("id", "tbtn");
        toggleBtn.setAttribute("onclick", "window.tfFrames.toggle();");
        toggleBtn.setAttribute("tabindex", "1");
        toggleBtn.appendChild(document.createTextNode("Hide >"));
        this.toggleBtn = toggleBtn;
        body.appendChild(toggleBtn);

        var testBtn = document.createElement("button");
        testBtn.setAttribute("type", "button");
        testBtn.setAttribute("id", "tbtn");
        testBtn.setAttribute("onclick", "window.tfFrames.test();");
        testBtn.setAttribute("tabindex", "2");
        testBtn.appendChild(document.createTextNode("Test >"));
        this.testBtn = testBtn;
        body.appendChild(testBtn);

        var form = document.createElement("form");
        this.form = form;

        var listElement = document.createElement("ol");

        var step0Element = document.createElement("li");
        listElement.appendChild(step0Element);
        var step0PElement = document.createElement("p");
        var step0Label = document.createElement("label");
        step0Label.innerHTML = "Give a name ";
        step0PElement.appendChild(step0Label);
        var nameInput = document.createElement("input");
        nameInput.setAttribute("type", "text");
        nameInput.setAttribute("id", "name");
        nameInput.setAttribute("tabindex", "3");
        this.nameElement = nameInput;
        step0PElement.appendChild(nameInput);
        step0Element.appendChild(step0PElement);

        var step1Element = document.createElement("li");
        listElement.appendChild(step1Element);
        var step1PElement = document.createElement("p");
        step1PElement.appendChild(document.createTextNode("(Optional) Paste previously generated frame data into textarea below and "));
        var loadBtn = document.createElement("button");
        loadBtn.setAttribute("type", "button");
        loadBtn.setAttribute("onclick", "window.tfFrames.loadFrames();");
        loadBtn.setAttribute("tabindex", "4");
        loadBtn.appendChild(document.createTextNode("Load"));
        this.loadBtn = loadBtn;
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
        number.setAttribute("tabindex", "5");
        this.frameCount = number;
        step2PElement.appendChild(number);

        step2PElement.appendChild(document.createTextNode(" frames with class "));
        
        var clazz = document.createElement("input");
        clazz.setAttribute("type", "text");
        clazz.setAttribute("value", "");
        clazz.setAttribute("id", "frameClass");
        clazz.setAttribute("tabindex", "6");
        this.frameClass = clazz;
        step2PElement.appendChild(clazz);

        step2PElement.appendChild(document.createTextNode(" with name "));

        var fName = document.createElement("input");
        fName.setAttribute("type", "text");
        fName.setAttribute("value", "");
        fName.setAttribute("id", "frameName");
        fName.setAttribute("tabindex", "7");
        this.frameName = fName;
        step2PElement.appendChild(fName);

        var goBtn = document.createElement("button");
        goBtn.setAttribute("type", "button");
        goBtn.setAttribute("onclick", "window.tfFrames.generateFrames();");
        goBtn.setAttribute("tabindex", "8");
        goBtn.appendChild(document.createTextNode("Go >"));
        this.goBtn = goBtn;
        step2PElement.appendChild(goBtn);
        step2Element.appendChild(step2PElement);


        var step3Element = document.createElement("li");
        listElement.appendChild(step3Element);
        var step3PElement = document.createElement("p");
        step3PElement.appendChild(document.createTextNode("Select "));
        var selectFrame = document.createElement("select");
        selectFrame.setAttribute("name", "frame");
        selectFrame.setAttribute("onchange", "window.tfFrames.changeSelectFrame();");
        selectFrame.setAttribute("tabindex", "9");
        this.selectFrame = selectFrame;
        step3PElement.appendChild(selectFrame);
        step3PElement.appendChild(document.createTextNode(" frame and set style to "));
        var frameStyle = document.createElement("input");
        frameStyle.setAttribute("type", "text");
        frameStyle.setAttribute("value", "");
        frameStyle.setAttribute("id", "frameStyle");
        frameStyle.setAttribute("style", "width:500px;");
        frameStyle.setAttribute("onkeyup", "window.tfFrames.setFrameStyle();");
        frameStyle.setAttribute("tabindex", "10");
        this.frameStyle = frameStyle;
        step3PElement.appendChild(frameStyle);
        var frameExposureCount = document.createElement("input");
        frameExposureCount.setAttribute("type", "number");
        frameExposureCount.setAttribute("value", "1");
        frameExposureCount.setAttribute("id", "frameExposureCount");
        frameExposureCount.setAttribute("onblur", "window.tfFrames.setFrameExposureCount();");
        frameExposureCount.setAttribute("tabindex", "11");
        this.exposureCount = frameExposureCount;
        step3PElement.appendChild(frameExposureCount);
        step3Element.appendChild(step3PElement);

        var step4Element = document.createElement("li");
        //listElement.appendChild(step4Element);
        var step4PElement = document.createElement("p");
        step4PElement.appendChild(document.createTextNode("Use "));
        var fName2 = document.createElement("input");
        fName2.setAttribute("type", "text");
        fName2.setAttribute("value", "");
        fName2.setAttribute("id", "frameName2");
        this.frameName2 = fName2;
        step4PElement.appendChild(fName2);
        step4PElement.appendChild(document.createTextNode(" frames and "));
        var genBtn = document.createElement("button");
        genBtn.setAttribute("type", "button");
        genBtn.setAttribute("onclick", "window.tfFrames.generateKeyframes();");
        genBtn.appendChild(document.createTextNode("Generate Keyframes >"));
        this.genBtn = genBtn;
        step4PElement.appendChild(genBtn);
        //step4Element.appendChild(step4PElement);

        form.appendChild(listElement);
        body.appendChild(form);

        var outputElement = document.createElement("textarea");
        outputElement.setAttribute("rows", "10");
        outputElement.setAttribute("cols", "100");
        outputElement.setAttribute("id", "css");
        outputElement.setAttribute("tabindex", "12");
        this.output = outputElement;
        form.appendChild(outputElement);

        var framesDiv = document.createElement("div");
        framesDiv.setAttribute("class", "frames");
        this.framesDiv = framesDiv;
        body.appendChild(framesDiv);

        this.toggle();
    } 
}