/*!
 * oyomirror.js 1.0
 * tested with jQuery 3.4.0
 * http://www.oyoweb.nl
 *
 * © 2022 oYoSoftware
 * MIT License
 *
 * oyomirror is a tool to mirror an image in one of four directions
 */

function oyoMirror(image, side = "bottom", partSize = "25%", degrees = 90, perspective) {

    var width = $(image).width();
    var height = $(image).height();

    var percSign = partSize.toString().slice(-1);
    if (percSign === "%") {
        var svgHeight = parseFloat(partSize) / 100 * height;
        var svgWidth = parseFloat(partSize) / 100 * width;
    } else {
        var svgHeight = parseFloat(partSize);
        var svgWidth = parseFloat(partSize);
    }

    switch (true) {
        case side === "top":
            degrees = 90 + degrees;
            break;
        case side === "left":
            degrees = -90 - degrees;
            break;
        case side === "right":
            degrees = 90 + degrees;
            break;
        case side === "bottom":
            degrees = -90 - degrees;
            break;
    }

    var sin = Math.abs(Math.sin(degrees / 180 * Math.PI));
    var cos = Math.abs(Math.cos(degrees / 180 * Math.PI));

    var cssRotate, cssPerspective, cssScale;

    var mirror = document.createElement("div");
    $(mirror).attr("class", "oyomirror");

    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, "svg");
    $(svg).css("position", "relative");
    var backGround = "url(" + $(image).attr("src") + ") no-repeat";
    $(svg).css("background", backGround);
    $(svg).css("background-size", width);
    $(mirror).append(svg);

    var rect = document.createElementNS(svgNS, "rect");
    $(rect).attr("x", "0");
    $(rect).attr("y", "0");
    var mirrorIndex = $(".oyomirror").length + 1;
    var url = "url(#oyogradient" + mirrorIndex + ")";
    $(rect).attr("fill", url);
    $(svg).append(rect);
    var gradient = document.createElementNS(svgNS, "linearGradient");
    $(gradient).attr("id", "oyogradient" + mirrorIndex);
    $(gradient).attr("gradientUnits", "userSpaceOnUse");
    $(svg).append(gradient);
    var stop = document.createElementNS(svgNS, "stop");
    $(stop).attr("offset", "0%");
    $(stop).attr("stop-color", "white");
    $(stop).attr("stop-opacity", 1);
    $(gradient).append(stop);
    var stop = document.createElementNS(svgNS, "stop");
    $(stop).attr("offset", "100%");
    $(stop).attr("stop-color", "white");
    $(stop).attr("stop-opacity", 0);
    $(gradient).append(stop);

    initMirror();

    function initMirror() {
        switch (true) {
            case side === "top":
                $(svg).attr("width", width);
                $(svg).attr("height", svgHeight);
                var top = 0.5 * (svgHeight - cos * svgHeight);
                $(svg).css("top", top);
                $(rect).attr("width", width);
                $(rect).attr("height", svgHeight);
                $(gradient).attr("x1", width / 2);
                $(gradient).attr("x2", width / 2);
                $(gradient).attr("y1", svgHeight);
                $(gradient).attr("y2", 0);
                cssRotate = "rotateX(" + degrees + "deg)";
                var position = "0% 0%";
                $(svg).css("background-position", position);
                break;
            case side === "left":
                $(svg).attr("width", svgWidth);
                $(svg).attr("height", height);
                var left = 0.5 * (svgWidth - cos * svgWidth);
                $(svg).css("left", left);
                $(rect).attr("width", svgWidth);
                $(rect).attr("height", height);
                $(gradient).attr("x1", svgWidth);
                $(gradient).attr("x2", 0);
                $(gradient).attr("y1", height / 2);
                $(gradient).attr("y2", height / 2);
                cssRotate = "rotateY(" + degrees + "deg)";
                var position = "0% 0%";
                $(svg).css("background-position", position);
                break;
            case side === "right":
                $(svg).attr("width", svgWidth);
                $(svg).attr("height", height);
                var left = -0.5 * (svgWidth - cos * svgWidth);
                $(svg).css("left", left);
                $(rect).attr("width", svgWidth);
                $(rect).attr("height", height);
                $(gradient).attr("x1", 0);
                $(gradient).attr("x2", svgWidth);
                $(gradient).attr("y1", height / 2);
                $(gradient).attr("y2", height / 2);
                cssRotate = "rotateY(" + degrees + "deg)";
                var position = "100% 0%";
                $(svg).css("background-position", position);
                break;
            case side === "bottom":
                $(svg).attr("width", width);
                $(svg).attr("height", svgHeight);
                var top = -0.5 * (svgHeight - cos * svgHeight);
                $(svg).css("top", top);
                $(rect).attr("width", width);
                $(rect).attr("height", svgHeight);
                $(gradient).attr("x1", width / 2);
                $(gradient).attr("x2", width / 2);
                $(gradient).attr("y2", svgHeight);
                $(gradient).attr("y1", 0);
                cssRotate = "rotateX(" + degrees + "deg)";
                var position = "0% 100%";
                $(svg).css("background-position", position);
                break;
        }

        if (degrees % 180 !== 0) {
            if (perspective === undefined) {
                switch (true) {
                    case side === "top":
                        perspective = (width + cos * svgHeight) / 2;
                        break;
                    case side === "left":
                        perspective = (height + cos * svgWidth) / 2;
                        break;
                    case side === "right":
                        perspective = (height + cos * svgWidth) / 2;
                        break;
                    case side === "bottom":
                        perspective = (width + cos * svgHeight) / 2;
                        break;
                }
            }
            cssPerspective = "perspective(" + perspective + "px)";

            switch (true) {
                case side === "top":
                    var factor = (perspective - sin * svgHeight / 2) / perspective;
                    var scale = 1 / factor;
                    cssScale = "scale(" + scale + ")";
                    break;
                case side === "left":
                    var factor = (perspective - sin * svgWidth / 2) / perspective;
                    var scale = 1 / factor;
                    cssScale = "scale(" + scale + ")";
                    break;
                case side === "right":
                    var factor = (perspective - sin * svgWidth / 2) / perspective;
                    var scale = 1 / factor;
                    cssScale = "scale(" + scale + ")";
                    break;
                case side === "bottom":
                    var factor = (perspective - sin * svgHeight / 2) / perspective;
                    var scale = 1 / factor;
                    cssScale = "scale(" + scale + ")";
                    break;
            }
        }

        var transform = "";
        if (cssPerspective) {
            transform += cssPerspective;
        }
        if (cssRotate) {
            transform += " " + cssRotate;
        }
        if (cssScale) {
            transform += " " + cssScale;
        }

        $(svg).css("transform", transform);
    }

    mirror.changeOpacity = function (startOpacity = 1, endOpacity = 0) {
        $("stop", gradient).eq(0).attr("stop-opacity", 1 - endOpacity);
        $("stop", gradient).eq(1).attr("stop-opacity", 1 - startOpacity);
    };

    mirror.changeFadeColor = function (color) {
        $("stop", gradient).eq(0).attr("stop-color", color);
    };

    return mirror;

}