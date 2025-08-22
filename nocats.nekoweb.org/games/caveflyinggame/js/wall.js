/**
 * Wall class, extends Polygon see polygon.js
 */
var Wall = Polygon.extend({

		/**
		 * Bounds for the Wall
		 */
		maxX: null,
		maxY: null,

		/**
		 * Constructor
		 *
		 * @param  {Array<number>} p list of verticies
		 * @param  {number}        s scalefactor, size of Wall
		 * @param  {number}        x start x coordinate
		 * @param  {number}        y start y coordinate
		 */
		init: function (p, s, x, y) {
			this._super(p); // call super constructor

			// position vars
			this.x = x;
			this.y = y;

			// scale the Wall to the specified size
			this.size = s;
			this.scale(s);

			// Set rotation angle used in each update
			this.rotAngle = 0.02 * (Math.random() * 2 - 1);

			// Generate and calculate velocity
			var r = 2 * Math.PI * Math.random();
			var v = Math.random() + Math.random() + 1;
			this.vel = {
				x: v * Math.cos(r),
				y: v * Math.sin(r)
			}
		},

		/**
		 * Useful point in polygon check, taken from:
		 * http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
		 *
		 * @param  {number}  x test x coordinate
		 * @param  {number}  y test y coordinate
		 * @return {Boolean}   result from check
		 *
		 * @override Polygon.hasPoint
		 */
		hasPoint: function (x, y) {
			return this._super(this.x, this.y, x, y);
		},

		/**
		 * Draw the Wall with an augmented drawing context
		 *
		 * @param  {context2d} ctx augmented drawing conext
		 */
		draw: function (ctx) {
			ctx.drawPolygon(this, this.x, this.y);
		}
	});
