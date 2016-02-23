/*
Modified version of code from https://github.com/stuartmemo/wavy-jones
*/
var WavyJones = function (context, elem) {
  var analyser = context.createAnalyser();
  var elem = document.getElementById(elem);

  analyser.width = elem.offsetWidth;
  analyser.height = elem.offsetHeight;
  analyser.lineColor = 'yellow';
  analyser.lineThickness = 1;

  var svgNamespace = "http://www.w3.org/2000/svg";
  var paper = document.createElementNS(svgNamespace, "svg");
  paper.setAttribute('width', analyser.width);
  paper.setAttribute('height', analyser.height);
  paper.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
  elem.appendChild(paper);

  var oscLine = document.createElementNS(svgNamespace, "path");
  oscLine.setAttribute("stroke", analyser.lineColor);
  oscLine.setAttribute("stroke-width", analyser.lineThickness);
  oscLine.setAttribute("fill","none");
  paper.appendChild(oscLine);

  var noDataPoints = 10;

    var zoom = 20;

    var dataSize = zoom;
    var allData = [];
    var compress = zoom;


  var drawLine = function () {
    var freqData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(freqData);

    var graphPoints = [],
      graphStr = '';

    graphPoints.push('M0, ' + (analyser.height/2));

      allData = allData.concat(freqData);
      if(allData.length>dataSize){
        allData = allData.slice(allData.length-dataSize);
      }

    for(var j=0;j<allData.length;j++){
        for (var i = 0; i < allData[j].length; i++) {
            if (i % noDataPoints) {
                var currFreqData = allData[j];
                var ypos = ((currFreqData.length)*j + i)/compress;
                var point = (currFreqData[i] / 128) * (analyser.height / 2);
                graphPoints.push('L' + ypos + ', ' + point);
              }
        }
    }

    for (i = 0; i < graphPoints.length; i++) {
      graphStr += graphPoints[i];
    }

    oscLine.setAttribute("stroke", analyser.lineColor);
    oscLine.setAttribute("stroke-width", analyser.lineThickness);

    oscLine.setAttribute("d", graphStr);
//      console.debug("\n\n\n" + graphStr);

    setTimeout(drawLine, 1);
  };

  drawLine();

  return analyser;
};
