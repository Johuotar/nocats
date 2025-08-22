/**
 * Bullet class, nothing fancy ^_^
 */
var Bullet = Class.extend({

		/**
		 * Bounds for the bullet
		 */
		maxX: null,
		maxY: null,

		/**
		 * Constructor
		 *
		 * @param  {number} x     start x coordinate
		 * @param  {number} y     start y coordinate
		 * @param  {number} angle direction in which to fire
		 */
		init: function (x, y, angle) {
			this.x = x;
			this.y = y;

			this.shallRemove = false;

			// set velocity according to angle param
			this.vel = {
				x: 11 * Math.cos(angle),
				y: 11 * Math.sin(angle)
			}
			
			// bullet gravity
			this.gravity = 0.02;
			
		},

		/**
		 * Update position of bullet
		 */
		update: function () {
			// saves previous position, used when rendering
			this.prevx = this.x;
			this.prevy = this.y;

			// translate position
			this.x += this.vel.x;
			this.y += this.vel.y;
			
			//apply gravity
			this.vel.y += this.gravity;
		},

		/**
		 * Draw the bullet to an augmented drawing context
		 *
		 * @param  {context2d} ctx agumented drawing context
		 */
		draw: function (ctx) {
			ctx.beginPath();
			ctx.moveTo(this.prevx, this.prevy);
			ctx.lineTo(this.x, this.y);
			ctx.stroke();
		}
	});
