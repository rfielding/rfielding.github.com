//Once the geometry of the guitar is setup, coordinate translation should be uniform
function doTranslate(gtx, pitch, str, result) {
    var hspan = gtx.right - gtx.left;
    var vspan = gtx.bottom - gtx.top;
    result[0] = pitch*hspan + gtx.nut;
    var increase = (0.70 + 0.15*pitch);
    var downshift = (vspan - vspan*increase)/2;
    var halfString = 0.5*vspan/(gtx.stringCount);
    result[1] = increase*(gtx.bottom - (str*vspan/gtx.stringCount + halfString))+downshift;
}

function moveTo(gtx, pitch, str) {
    var result = [];
    doTranslate(gtx, pitch, str, result);
    gtx.ctx.moveTo(result[0], result[1]);
}

function lineTo(gtx, pitch, str) {
    var result = [];
    doTranslate(gtx, pitch, str, result);
    gtx.ctx.lineTo(result[0], result[1]);
}

function fillText(gtx, m, pitch, str) {
    var result = [];
    doTranslate(gtx, pitch, str, result);
    gtx.ctx.fillText(m, result[0]-3, result[1] + 4);
}

function arc(gtx, pitch, str, r) {
    var result = [];
    doTranslate(gtx, pitch, str, result);
    gtx.ctx.arc(result[0], result[1], r, 0,2*Math.PI);
}

function fretToPitch(gtx, fret) {
    return 2-Math.pow(2, 1-fret/gtx.edo);
}

function doDiagram(divid, label, edo, strings, markers, fretWidth) {
    //Setup drawing surface
    var c = document.getElementById(divid);
    if(c) {
        c.width = 600;
        c.height = 100;
        
        gtx = {};
        gtx.c = c;
        gtx.edge = 0.5;
        gtx.edo = edo;
        gtx.nut = 20;
        gtx.left = 0;
        gtx.right = c.width*0.9;
        gtx.top = 0;
        gtx.bottom = c.height;
        gtx.stringCount = strings.length;
        gtx.markerRadius = 3;
        gtx.markColor = "blue";
        ctx = gtx.ctx = c.getContext("2d");
        ctx.font = "9px Arial";

        var octavePitch = fretToPitch(gtx, gtx.edo);
        var highPitch = fretToPitch(gtx, gtx.edo+1);
        var labelPitch = fretToPitch(gtx,-0.5);
        var nutPitch = fretToPitch(gtx, 0);
        var topString = gtx.stringCount-1;
        var bottomString = 0;

        ctx.beginPath();
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "gray";
        moveTo(gtx, highPitch, topString+gtx.edge);
        lineTo(gtx, nutPitch, topString+gtx.edge);
        lineTo(gtx, nutPitch, bottomString-gtx.edge);
        lineTo(gtx, highPitch, bottomString-gtx.edge);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 6;
        ctx.strokeStyle = "gray";
        moveTo(gtx, nutPitch, topString+gtx.edge);
        lineTo(gtx, nutPitch, bottomString-gtx.edge);
        ctx.stroke();

        for(var i=0; i < gtx.stringCount; i++ ) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
            moveTo(gtx, nutPitch, i);
            lineTo(gtx, highPitch, i);
            ctx.stroke();
            fillText(gtx, strings[i], labelPitch, i);
        }

        for(var i=0; i <= gtx.edo; i++) {
            ctx.beginPath();
            ctx.lineWidth = fretWidth(i)*0.5;
            ctx.strokeStyle = "black";
            var p = fretToPitch(gtx, i);
            moveTo(gtx, p, topString+gtx.edge);
            lineTo(gtx, p, bottomString-gtx.edge);
            ctx.stroke();
        }

       
        ctx.lineWidth = 1;
        ctx.strokeStyle = "gray";
        for(var i=0; i < markers.length; i++) {
            ctx.beginPath();
            var p = fretToPitch(gtx, markers[i]-0.5);
            arc(gtx, p, topString/2, gtx.markerRadius);
            ctx.stroke();
        }
        //Add octave markers
        var p = fretToPitch(gtx, gtx.edo-0.5);
        ctx.beginPath();
        arc(gtx, p, topString/2+1, gtx.markerRadius);
        ctx.stroke();
        ctx.beginPath();
        arc(gtx, p, topString/2-1, gtx.markerRadius);
        ctx.stroke();

        ctx.lineWidth = 1;
        ctx.fillText(gtx.edo+"EDO",0,10);
        ctx.fillText(label,0,gtx.bottom-3);

        return gtx;
    } else {
        console.log("cant make rect");
    }
    return null;
}

function markDiagram(gtx, number, pitch, str) {
    var p = fretToPitch(gtx, pitch);
    ctx.lineWidth = 1;
    ctx.fillStyle = gtx.markColor;
    ctx.beginPath();
    arc(gtx, p, str, 2*gtx.markerRadius);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.beginPath();
    fillText(gtx,""+number,p,str);
    ctx.fill();
}

function markColor(gtx,color) {
    gtx.markColor = color;
}

function markLine(gtx, pitch1,str1, pitch2,str2, color) {
    ctx.lineWidth=2;
    ctx.strokeStyle = color;
    ctx.beginPath();
    moveTo(gtx,pitch1,str1);
    lineTo(gtx,pitch2,str2);
    ctx.stroke();
}

function doinit() {
    var edo = 24;
    var strings = ["E", "A", "D", "G", "C", "F"];
    var markers = [6, 10, 14, 18];
    var fretWidth = function(i){return ((i+1)%2)+1;}
    var d;

    d = doDiagram("diagram1", "Bayati on E - MM", edo, strings, markers, fretWidth);
    markLine(d, fretToPitch(d,0),0,fretToPitch(d,6),0, "red");
    markColor(d, "black");
    markDiagram(d, 0, 0, 0);
    markColor(d, "green");
    markDiagram(d, 1, 3, 0);
    markColor(d, "blue");
    markDiagram(d, 2, 6, 0);
    markDiagram(d, 3, 0, 1);
    markDiagram(d, 4, 4, 1);
    //markDiagram(d, 5, 6, 1);
    markDiagram(d, 5, 0, 2);
    markColor(d, "black");
    markDiagram(d, 0, 4, 2);
    markColor(d, "green");
    markDiagram(d, 1, 7, 2);
    markColor(d, "blue");

    d = doDiagram("diagram1A", "Minor on E - LS", edo, strings, markers, fretWidth);
    markLine(d, fretToPitch(d,0),0,fretToPitch(d,6),0, "red");
    markColor(d, "black");
    markDiagram(d, 0, 0, 0);
    markColor(d, "green");
    markDiagram(d, 1, 4, 0);
    markColor(d, "blue");
    markDiagram(d, 2, 6, 0);
    markDiagram(d, 3, 0, 1);
    markDiagram(d, 4, 4, 1);
    //markDiagram(d, 5, 6, 1);
    markDiagram(d, 5, 0, 2);
    markColor(d, "black");
    markDiagram(d, 0, 4, 2);
    markColor(d, "green");
    markDiagram(d, 1, 8, 2);
    markColor(d, "blue");

    d = doDiagram("diagram1B", "Phrygian on E - SL", edo, strings, markers, fretWidth);
    markLine(d, fretToPitch(d,0),0,fretToPitch(d,6),0, "red");
    markColor(d, "black");
    markDiagram(d, 0, 0, 0);
    markColor(d, "green");
    markDiagram(d, 1, 2, 0);
    markColor(d, "blue");
    markDiagram(d, 2, 6, 0);
    markDiagram(d, 3, 0, 1);
    markDiagram(d, 4, 4, 1);
    //markDiagram(d, 5, 6, 1);
    markDiagram(d, 5, 0, 2);
    markColor(d, "black");
    markDiagram(d, 0, 4, 2);
    markColor(d, "green");
    markDiagram(d, 1, 6, 2);
    markColor(d, "blue");

    d = doDiagram("diagram2", "Bayati on B - MM", edo, strings, markers, fretWidth);
    markLine(d, fretToPitch(d,4),1,fretToPitch(d,10),1, "red");
    markDiagram(d, -1, 0, 1);
    markColor(d, "black");
    markDiagram(d, 0, 4, 1);
    markColor(d, "green");
    markDiagram(d, 1, 7, 1);
    markColor(d, "blue");
    markDiagram(d, 2, 10, 1);
    markDiagram(d, 2, 0, 2);
    markDiagram(d, 3, 4, 2);
    markColor(d, "green");
    markDiagram(d, 4, 7, 2);
    markColor(d, "blue");
    markDiagram(d, 5, 10, 2);

    d = doDiagram("diagram3", "Nahawand on A - LS", edo, strings, markers, fretWidth);
    markLine(d, fretToPitch(d,0),1,fretToPitch(d,6),1, "red");
    markColor(d, "black");
    markDiagram(d, 0, 0, 1);
    markColor(d, "blue");
    markDiagram(d, 1, 4, 1);
    markDiagram(d, 2, 6, 1);
    markDiagram(d, 3, 0, 2);
    markDiagram(d, 4, 4, 2);

    d = doDiagram("diagram4", "Nahawand on D - LS", edo, strings, markers, fretWidth);
    markLine(d, fretToPitch(d,0),2,fretToPitch(d,6),2, "red");
    markDiagram(d,-3, 0, 1);
    markDiagram(d,-2, 4, 1);
    markDiagram(d,-1, 6, 1);
    markColor(d, "black");
    markDiagram(d, 0, 0, 2);
    markColor(d, "blue");
    markDiagram(d, 1, 4, 2);
    markDiagram(d, 2, 6, 2);
    markDiagram(d, 3, 0, 3);
    markDiagram(d, 4, 4, 3);

    d = doDiagram("diagram5", "Kurd on E - SL", edo, strings, markers, fretWidth);
    markLine(d, fretToPitch(d,4),2,fretToPitch(d,10),2, "red");
    markDiagram(d,-1, 0, 2);
    markColor(d, "black");
    markDiagram(d, 0, 4, 2);
    markColor(d, "blue");
    markDiagram(d, 1, 6, 2);
    markDiagram(d, 2,10, 2);
    markDiagram(d, 3,14, 2);

    d = doDiagram("diagram6", "Hijaz on E - S(MM)S", edo, strings, markers, fretWidth);
    markLine(d, fretToPitch(d,6),2,fretToPitch(d,12),2, "red");
    markDiagram(d,-1, 0, 2);
    markColor(d, "black");
    markDiagram(d, 0, 4, 2);
    markColor(d, "blue");
    markDiagram(d, 1, 6, 2);
    markDiagram(d, 2,12, 2);
    markDiagram(d, 3,14, 2);
    markColor(d, "black");
    markDiagram(d, 0, 0, 0);
    markColor(d, "blue");
    markDiagram(d, 1, 2, 0);
    markDiagram(d, 2, 8, 0);
    markDiagram(d, 3,10, 0);

    d = doDiagram("diagram7", "On F", edo, strings, markers, fretWidth);
    markColor(d, "black");
    markDiagram(d, 0, 6, 2);
    markColor(d, "blue");
    markDiagram(d, 1, 8, 2);
    markDiagram(d, 2,12, 2);
    markDiagram(d, 3,14, 2);

    d = doDiagram("diagram8", "On F", edo, strings, markers, fretWidth);
    markDiagram(d,-1, 2, 2);
    markColor(d, "black");
    markDiagram(d, 0, 6, 2);
    markColor(d, "green");
    markDiagram(d, 1, 9, 2);
    markColor(d, "blue");
    markDiagram(d, 2,12, 2);
    markDiagram(d, 3,14, 2);

    d = doDiagram("diagram9", "Rast on D", edo, strings, markers, fretWidth);
    markLine(d, fretToPitch(d,6),1,fretToPitch(d,8),3, "red");
    markDiagram(d,-1, 6, 1);
    markColor(d, "black");
    markDiagram(d, 0,10, 1);
    markDiagram(d, 0, 0, 2);
    markColor(d, "blue");
    markDiagram(d, 1, 4, 2);
    markColor(d, "green");
    markDiagram(d, 2, 7, 2);
    markColor(d, "blue");
    markDiagram(d, 3,10, 2);
    markDiagram(d, 3, 0, 3);
    markDiagram(d, 4, 4, 3);
    markDiagram(d, 5, 8, 3);
    markDiagram(d, 6, 0, 4);
    markDiagram(d, 6,10, 3);
    markColor(d, "black");
    markDiagram(d, 7, 4, 4);
    markColor(d, "blue");
    markDiagram(d, 8, 8, 4);
    markDiagram(d,-2, 4, 1);
    markDiagram(d,-3, 0, 1);

    d = doDiagram("diagram10", "Generic Arabic Scale shape", edo, strings, markers, fretWidth);
    //markDiagram(d,"",  0, 0);
    markDiagram(d,"",  2, 0);
    markDiagram(d,"",  6, 0);
    markDiagram(d,"", 10, 0);

    markDiagram(d,"",  0, 1);
    markLine(d, fretToPitch(d,2),1,fretToPitch(d,4),1, "red");
    markColor(d, "#9999ff");
    markDiagram(d,"",  2, 1);
    markColor(d, "blue");
    markDiagram(d,"",  6, 1);
    markDiagram(d,"", 10, 1);

    markDiagram(d,"",  0, 2);
    markLine(d, fretToPitch(d,2),2,fretToPitch(d,4),2, "red");
    markColor(d, "#99ff99");
    markDiagram(d,"",  3, 2);
    markColor(d, "blue");
    markDiagram(d,"",  6, 2);
    markDiagram(d,"", 10, 2);

    markDiagram(d,"",  0, 3);
    markDiagram(d,"",  4, 3);
    markLine(d, fretToPitch(d,6),3,fretToPitch(d,8),3, "red");
    markColor(d, "#9999ff");
    markDiagram(d,"",  6, 3);
    markColor(d, "blue");
    markDiagram(d,"", 10, 3);

    markDiagram(d,"",  0, 4);
    markDiagram(d,"",  4, 4);
    markLine(d, fretToPitch(d,6),4,fretToPitch(d,8),4, "red");
    markColor(d, "#99ff99");
    markDiagram(d,"",  7, 4);
    markColor(d, "blue");
    markDiagram(d,"", 10, 4);

    markDiagram(d,"",  0, 5);
    markDiagram(d,"",  4, 5);
    markDiagram(d,"",  8, 5);
    markLine(d, fretToPitch(d,10),5,fretToPitch(d,12),5, "red");
    markColor(d, "#9999ff");
    markDiagram(d,"", 10, 5);
    markColor(d, "blue");

    d = doDiagram("diagram10a", "Generic Rast-like Arabic Scale shape", edo, strings, markers, fretWidth);
    markColor(d, "blue");
    markDiagram(d,"",  0, 1);
    markColor(d, "#99ff99");
    markDiagram(d,"",  3, 1);
    markColor(d, "blue");
    markDiagram(d,"",  6, 1);
    markColor(d, "#99ff99");
    markDiagram(d,"",  9, 1);
    markDiagram(d,"", 11, 1);
    markColor(d, "blue");
    markDiagram(d,"",  0, 2);
    markColor(d, "black");
    markDiagram(d,"",  3, 2);
    markColor(d, "#99ff99");
    markDiagram(d,"",  7, 2);
    markColor(d, "blue");
    markDiagram(d,"",  0, 3);
    markColor(d, "#99ff99");
    markDiagram(d,"",  3, 3);
    markDiagram(d,"",  7, 3);
    markColor(d, "blue");
    markDiagram(d,"",  0, 4);
    markColor(d, "#99ff99");
    markDiagram(d,"",  3, 4);
    markColor(d, "black");
    markDiagram(d,"",  7, 4);

    d = doDiagram("diagram11", "Harmonics", edo, strings, markers, fretWidth);
    for(var i=2; i<=18; i++) {
        var y = (7-i)/3+2.75;
        markLine(d, 2/i, y+0.5, 2/i, y+1.5, "red");
        d.strokeColor = "blue";
        d.fillColor = "blue";
        fillText(d, i, 2/i + 0.01, y);
        d.strokeColor = "black";
        d.fillColor = "black";
    }

    var edo2       = 53;
    var strings2   = ["E", "A", "D", "G", "C", "F"];
    var markers2   = [9, 18, 22, 31];
    var fretWidth2 = function(i){
        //31 frets is a perfect fifth,
        //22 frets is a perfect fourth
        //So make the fret width a function of how far away from root pitch it is
        //The fret width is basically a discrete log
        var widtha=4;
        var widthb=4;
        var j=0;
        while(j != (i%53)) {
            j = (j + 31) % 53;
            widtha *= 0.8;
        }
        var j=0;
        while(j != (i%53)) {
            j = (j + 22) % 53;
            widthb *= 0.8;
        }
        return widtha+widthb+0.1;
    }

    //Do the same with 53 equal
    d = doDiagram("diagram12", "53 Equal Temperment - tuned by harmonics", edo2, strings2, markers2, fretWidth2);
    for(var i=2; i<=19; i++) {
        var y = (7-i)/3+2.75;
        markLine(d, 2/i, y+0.5, 2/i, y+1.5, "red");
        d.strokeColor = "blue";
        d.fillColor = "blue";
        fillText(d, i, 2/i + 0.01, y);
        d.strokeColor = "black";
        d.fillColor = "black";
    }

    var edo3       = 31;
    var strings3   = ["E", "A", "D", "G", "C", "F"];
    var markers3   = [5, 8, 13, 18, 26];
    var fretWidth3 = function(i){
/*
        //31 frets is a perfect fifth,
        //22 frets is a perfect fourth
        //So make the fret width a function of how far away from root pitch it is
        //The fret width is basically a discrete log
        var widtha=4;
        var widthb=4;
        var j=0;
        while(j != (i%31)) {
            j = (j + 31) % 31;
            widtha *= 0.8;
        }
        var j=0;
        while(j != (i%31)) {
            j = (j + 22) % 31;
            widthb *= 0.8;
        }
        return widtha+widthb+0.1;
*/
        return 1;
    }

    //Do the same with 53 equal
    //Do the same with 31 equal
    d = doDiagram("diagram13", "31 Equal Temperment", edo3, strings3, markers3, fretWidth3);
    for(var i=2; i<=19; i++) {
        var y = (7-i)/3+2.75;
        markLine(d, 2/i, y+0.5, 2/i, y+1.5, "red");
        d.strokeColor = "blue";
        d.fillColor = "blue";
        fillText(d, i, 2/i + 0.01, y);
        d.strokeColor = "black";
        d.fillColor = "black";
    }
}
