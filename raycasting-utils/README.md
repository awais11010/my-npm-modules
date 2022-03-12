# raycasting-utils

Fast utilities for ray-casting against sets of triangles, or a set of axis-aligned bounding boxes, or a distance function (implicit surface).

Triangles are organized using `bvh-tree-plus`

Boxes are organized using `rbush-3d`

Distance functions are queried using naive marching spheres.

## Installation

```sh
npm i raycasting-utils
```

## Usage 

```javascript
var rcu = require('raycasting-utils');

// aabb = [[x,y,z],[x,y,z]] //axis aligned bounding box = [minimum pt, maximum pt]
// ray = {point:{x,y,z}, vector: {x,y,z}} //raycasting direction 
// line = [[x,y,z],[x,y,z]] //raycasting direction using line segment coords instead of ray
// triangle = [[x,y,z],[x,y,z],[x,y,z]]

// functions ending with _useLine take a line segment instead of a ray object, but work the same

// rcu.traceDf(ray, df, maxSteps = 256, minDist = 0.05) //returns distance from raycasting distance function df, using marching spheres technique. bail out if dist<minDist 
// rcu.traceDf_useLine

// rcu.aabbsTraceFast([aabb]) => returns function(ray) which returns distance
// rcu.aabbsTraceFast_useLine

// rcu.aabbsTraceBVH([aabb]) => similar to aabbsTraceFast, but converts the boxes to triangles and casts using a BVH instead of the RTree. Usually slower.
// rcu.aabbsTraceBVH_useLine

// rcu.aabb2Triangles(aabb) => convert aabb to list of triangles

// rcu.trianglesTraceFast([tri], backfaceCulling=true) => similar to aabbsTraceFast, but for list of triangles 
// rcu.trianglesTraceFast_useLine

// rcu.trianglesTraceFast_returnIndex => similar to above, but returns {dist, index: indexOfTriangleThatGetsHit or -1}
// rcu.trianglesTraceFast_returnIndex_useLine

// rcu.trianglesTraceFast_colored => returns [dist, color] where color is pulled from triangle.color
// rcu.trianglesTraceFast_colored_useLine

// rcu.getBvh() => return most recently created BVH object
// rcu.getRtree() => return most recently created RTree object

// "sector" can be used as alias for aabb
// rcu.sector2Triangles
// rcu.sectorsTraceBVH
// rcu.sectorsTraceBVH_useLine
// rcu.sectorsTraceFast
// rcu.sectorsTraceFast_useLine
```