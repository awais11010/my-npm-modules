/***
 points-in-triangle - implementation of bresenham based triangle rasterization
 by Michael Strassburger <codepoet@cpan.org>
 ***/

//license

/*
The MIT License (MIT) Copyright (c) 2014 Matt DesLauriers

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


//stonkpunk -- added cropping + barycentric coordinate color mapping

var bresenham = require('bresenham');
var bc = require('barycentric-coordinates');

var line = (from, to) => bresenham(from[0], from[1], to[0], to[1]);

var tib = require('./triangle-inside-bounds.js')
var tob = require('./triangle-outside-bounds.js')

function compare(a,b){
    return a.y === b.y ? a.x-b.x : a.y-b.y
}

module.exports = (triangle, triangleVertexColors, w, h, callback, edgesOnly) => {

    var croppingNeeded = !tib(triangle,w,h);
    var skipTriangle = tob(triangle,w,h);if(skipTriangle){return;}

    var tri3d = [
        [triangle[0][0], 0,triangle[0][1]],//, 0],
        [triangle[1][0], 0,triangle[1][1]],//, 0],
        [triangle[2][0], 0,triangle[2][1]] //, 0]
    ];

    // Get all points on the triangles' sides ...
    let points = [].concat(
        triangle[1][1]< triangle[2][1] ? line(triangle[1], triangle[2]) : line(triangle[2], triangle[1]),
        triangle[0][1]< triangle[2][1] ? line(triangle[0], triangle[2]) : line(triangle[2], triangle[0]),
        triangle[0][1]< triangle[1][1] ? line(triangle[0], triangle[1]) : line(triangle[1], triangle[0])
    )//.sort((a, b) => a.y === b.y ? a.x-b.x : a.y-b.y)

    if(!edgesOnly){
        points = points.sort(compare);
    }

    var pl = points.length;

    if(croppingNeeded){
        for(var i=0;i<pl;i++){
            var pt = points[i];
            pt.x=Math.max(pt.x,0);
            pt.y=Math.max(pt.y,0);
            pt.x=Math.min(pt.x,w-1);
            pt.y=Math.min(pt.y,h-1);
        }
    }

    if(edgesOnly){
        for(var i=0;i<pl;i++){
            var point = points[i];
            var color = bc.triangleInterpolateNormals([point.x,0,point.y],tri3d, triangleVertexColors[0],triangleVertexColors[1],triangleVertexColors[2])
            callback(point.x, point.y, color); //here we draw the edges
        }
    }else{
        // To finally iterate over the space between each point
        for(var i=0;i<pl;i++){
            var point = points[i];
            let next = points[i+1];
            if (next && point.y === next.y) {
                //var color = point.color;
                for(let x=point.x; x<next.x; x++) {
                    var color = bc.triangleInterpolateNormals([x,0,point.y],tri3d, triangleVertexColors[0],triangleVertexColors[1],triangleVertexColors[2])
                    callback(x, point.y, color); //here we draw the volume
                }
            } else {
                var color = bc.triangleInterpolateNormals([point.x,0,point.y],tri3d, triangleVertexColors[0],triangleVertexColors[1],triangleVertexColors[2])
                callback(point.x, point.y, color); //here we draw the edges
            }
        }
    }


};
