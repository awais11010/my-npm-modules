/***
 points-in-triangle - implementation of bresenham based triangle rasterization
 by Michael Strassburger <codepoet@cpan.org>
 ***/

//stonkpunk -- added cropping + barycentric coordinate color mapping

var bresenham = require('bresenham');
var bc = require('barycentric-coordinates');

var line = (from, to) => bresenham(from[0], from[1], to[0], to[1]);

var tib = require('./triangle-inside-bounds.js')

module.exports = (triangle, triangleVertexColors, w, h, callback, edgesOnly) => {

    var croppingNeeded = !tib(triangle,w,h);

    var tri3d = [
        [triangle[0][0], 0,triangle[0][1]],//, 0],
        [triangle[1][0], 0,triangle[1][1]],//, 0],
        [triangle[2][0], 0,triangle[2][1]]//, 0]
    ];

    // Get all points on the triangles' sides ...
    let points = [].concat(
        line(triangle[1], triangle[2]),
        line(triangle[0], triangle[2]),
        line(triangle[0], triangle[1])
    )
        // ... and sort them by y, x
    .sort((a, b) => a.y === b.y ? a.x-b.x : a.y-b.y)

    if(croppingNeeded){
        points = points.map(function(pt){
            pt.x=Math.max(pt.x,0);
            pt.y=Math.max(pt.y,0);
            pt.x=Math.min(pt.x,w-1);
            pt.y=Math.min(pt.y,h-1);
            return pt;
        });
    }

    if(edgesOnly){
        // To finally iterate over the space between each point
        points.forEach((point, i) => {
            //let next = points[i+1];
            //if (next && point.y === next.y) {
                // //var color = point.color;
                // for(let x=point.x; x<next.x; x++) {
                //     var color = bc.triangleInterpolateNormals([x,0,point.y],tri3d, triangleVertexColors[0],triangleVertexColors[1],triangleVertexColors[2])
                //     callback(x, point.y, color); //here we draw the volume
                // }
            //} else {
                var color = bc.triangleInterpolateNormals([point.x,0,point.y],tri3d, triangleVertexColors[0],triangleVertexColors[1],triangleVertexColors[2])
                callback(point.x, point.y, color); //here we draw the edges
            //}
        });
    }else{
        // To finally iterate over the space between each point
        points.forEach((point, i) => {
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
        });
    }


};
