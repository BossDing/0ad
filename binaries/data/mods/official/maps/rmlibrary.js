// Object type constants

const 
	TYPE_RECT_PLACER = 1,
	TYPE_TERRAIN_PAINTER = 2,
	TYPE_NULL_CONSTRAINT = 3,
	TYPE_LAYERED_PAINTER = 4,
	TYPE_AVOID_AREA_CONSTRAINT = 5,
	TYPE_CLUMP_PLACER = 6,
	TYPE_AVOID_TEXTURE_CONSTRAINT = 7,
	TYPE_ELEVATION_PAINTER = 8,
	TYPE_SMOOTH_ELEVATION_PAINTER = 9,
	TYPE_SIMPLE_GROUP = 10,
	TYPE_AVOID_TILE_CLASS_CONSTRAINT = 11,
	TYPE_TILE_CLASS_PAINTER = 12;

// SmoothElevationPainter constants

const ELEVATION_SET = 0;
const ELEVATION_MODIFY = 1;

// initFromScenario constants

const LOAD_NOTHING = 0; 
const LOAD_TERRAIN = 1;
const LOAD_INTERACTIVES = 2;
const LOAD_NON_INTERACTIVES = 4;
const LOAD_ALL = LOAD_TERRAIN | LOAD_INTERACTIVES | LOAD_NON_INTERACTIVES;

// Utility functions

function println(x) {
	print(x);
	print("\n");
}

function argsToArray(x) {
	if(x.length!=1) {
		var ret = new Array();
		for(var i=0; i<x.length; i++) {
			ret[i] = x[i];
		}
		return ret;
	}
	else {
		return x[0];
	}
}

function chooseRand() {
	if(arguments.length==0) {
		error("chooseRand: requires at least 1 argument");
	}
	var ar = argsToArray(arguments);
	return ar[randInt(ar.length)];
}

function createAreas(centeredPlacer, painter, constraint, num, maxFail) {
	if(maxFail == undefined) {
		maxFail = 10 * num;
	}
	
	var good = 0;
	var bad = 0;
	var ret = new Array();
	while(good < num && bad <= maxFail) {
		centeredPlacer.x = randInt(SIZE);
		centeredPlacer.y = randInt(SIZE);
		var r = createArea(centeredPlacer, painter, constraint);
		if(r) {
			good++;
			ret[ret.length] = r;
		}
		else {
			bad++;
		}
	}
	return ret;
}

function createObjectGroups(placer, constraint, num, maxFail) {
	if(maxFail == undefined) {
		maxFail = 10 * num;
	}
	
	var good = 0;
	var bad = 0;
	while(good < num && bad <= maxFail) {
		placer.x = randInt(SIZE);
		placer.y = randInt(SIZE);
		var r = createObjectGroup(placer, constraint);
		if(r) {
			good++;
		}
		else {
			bad++;
		}
	}
	return good;
}

// Area placers

function RectPlacer(x1, y1, x2, y2) {
	this.TYPE = TYPE_RECT_PLACER;
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
}

function TerrainPainter(terrain) {
	this.TYPE = TYPE_TERRAIN_PAINTER;
	this.terrain = terrain;
}

function ClumpPlacer(size, coherence, smoothness, failFraction, x, y) {
	this.TYPE = TYPE_CLUMP_PLACER;
	this.size = size;
	this.coherence = coherence;
	this.smoothness = smoothness;
	this.failFraction = failFraction!=undefined ? failFraction : 0;
	this.x = x!=undefined ? x : -1;
	this.y = y!=undefined ? y : -1;
}

// Area painters

function LayeredPainter(widths, terrains) {
	this.TYPE = TYPE_LAYERED_PAINTER;
	this.widths = widths;
	this.terrains = terrains;
}

function ElevationPainter(elevation) {
	this.TYPE = TYPE_ELEVATION_PAINTER;
	this.elevation = elevation;
}

function TileClassPainter(tileClass) {
	this.TYPE = TYPE_TILE_CLASS_PAINTER;
	this.tileClass = tileClass;
}

function SmoothElevationPainter(type, elevation, blendRadius) {
	this.TYPE = TYPE_SMOOTH_ELEVATION_PAINTER;
	this.type = type;
	this.elevation = elevation;
	this.blendRadius = blendRadius;
}

// Constraints

function NullConstraint() {
	this.TYPE = TYPE_NULL_CONSTRAINT;
}

function AvoidAreaConstraint(area) {
	this.TYPE = TYPE_AVOID_AREA_CONSTRAINT;
	this.area = area;
}

function AvoidTextureConstraint(texture) {
	this.TYPE = TYPE_AVOID_TEXTURE_CONSTRAINT;
	this.texture = texture;
}

function AvoidTileClassConstraint(tileClass, distance) {
	this.TYPE = TYPE_AVOID_TILE_CLASS_CONSTRAINT;
	this.tileClass = tileClass;
	this.distance = distance;
}

// Object groups

function SimpleObject(type, count, distance) {
	this.type = type;
	this.count = count;
	this.distance = distance;
}

function SimpleGroup(elements, tileClass, x, y) {
	this.TYPE = TYPE_SIMPLE_GROUP;
	this.elements = elements;
	this.tileClass = tileClass!=undefined ? tileClass : null;
	this.x = x!=undefined ? x : -1;
	this.y = x!=undefined ? y : -1;
}