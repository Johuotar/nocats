/**
 * part class, extends Polygon see polygon.js
 */
var Part = Polygon.extend({

		/**
		 * Bounds for the part
		 */
		maxX: null,
		maxY: null,

		/**
		 * Constructor
		 *
		 * @param  {Array<number>} p list of verticies
		 * @param  {number}        s scalefactor, size of part
		 * @param  {number}        x start x coordinate
		 * @param  {number}        y start y coordinate
		 * @param  {number}        vx velocity on x coordinate
		 * @param  {number}        vy velocity on y coordinate
		 */
		init: function (p, s, x, y, vx, vy) {
			this._super(p); // call super constructor

			// position vars
			this.x = x;
			this.y = y;

			// scale the part to the specified size
			this.size = s;
			this.scale(s);

			// Set rotation angle used in each update
			this.rotAngle = 0.02 * (Math.random() * 2 - 1);

			// Generate and calculate velocity using the ships velocity and randomize every part a bit
			this.vel = {
				x: vx + Math.random() * 2,
				y: vy + Math.random() * 2
			}
			
			var r = 2 * Math.PI * Math.random();
			var v = Math.random() + Math.random() + 1;
			
			// gravity
			this.gravity = 0.015;
			
			this.hasCrashed = false;
			
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
		 * Translate and rotate the part
		 */
		update: function () {
			
			// update position
			this.x += this.vel.x;
			this.y += this.vel.y;

			this.vel.x *= 0.99;
			this.vel.y *= 0.99;

			// falls by its gravity
			this.vel.y += this.gravity;
			// rotate parts
			this.rotate(this.rotAngle);
		},

		/**
		 * Draw the part with an augmented drawing context
		 *
		 * @param  {context2d} ctx augmented drawing conext
		 */
		draw: function (ctx) {
			ctx.drawPolygon(this, this.x, this.y);
		}
	});
