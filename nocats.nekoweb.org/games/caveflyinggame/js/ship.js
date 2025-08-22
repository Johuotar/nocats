/**
 * Ship class, extends Polygon see polygon.js
 */
var Ship = Polygon.extend({

		/**
		 * Bounds for the ship
		 */
		maxX: null,
		maxY: null,

		/**
		 * Constructor
		 *
		 * @param  {Array<number>} p  list of ship verticies
		 * @param  {Array<number>} pf list of flames verticies
		 * @param  {number}        s  scalefactor, size of ship
		 * @param  {number}        x  start x coordinate
		 * @param  {number}        y  start y coordinate
		 */
		init: function (p, pf, s, x, y) {
			this._super(p); // call super constructor

			// create, init and scale flame polygon
			this.flames = new Polygon(pf);
			this.flames.scale(s);

			// visual flags
			this.drawFlames = false;
			this.visible = true;
			this.drawTractorbeam = false;

			// position vars
			this.x = x;
			this.y = y;

			// scale the ship to the specified size
			this.scale(s);

			// facing direction
			this.angle = 0;

			// velocity
			this.vel = {
				x: 0,
				y: 0
			}

			// hitpoints AKA hp
			this.hp = 50;

			// max hitpoints AKA maxhp
			this.maxhp = 50;
			
			// fuel
			this.fuel = 40.0;

			// max fuel
			this.maxfuel = 40.0;

			// max velocity
			this.maxvel = 5.5;
			
			// tractorbeam lenght, status and end point
			this.tractorbeamLength = 75;
			this.carryingObject = false;
			this.tractorbeamX;
			this.tractorbeamY;
			this.tractorbeamGravity = 4

			// gravity and weight of carried object
			this.gravity = 0.008;
			this.weight = 0.015;

			//cooldown
			this.fireSpeed = 90;
			this.fireCooldown = 0;
			
			// acceleration
			this.acceleration = 0.03;

			//angle is random when firing second firetype
			this.angleshift = Math.random() - 0.4
			this.angleshift *= Math.floor(Math.random() * 2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases

			// ammo
			this.ammo = 100;
			
			// max ammo AKA maxammo
			this.maxammo = 100;

		},

		/**
		 * Returns whether ship is colling with poly
		 * Could be removed if the overridden collide func in polygon class is improved to work with ships. 21.9.2018
		 * Javascript has no overloading, so the last one overrides the previous function
		 * @param  {Asteroid} astr asteroid to test
		 * @return {Boolean}       result from test
		 */
		
		collide: function (astr) {
			// don't test if not visible
			if (!this.visible) {
				return false;
			}
			// don't test if the object no longer exists, bullet destroyed it etc
			if (astr == null) {
				console.log("ship collide function target was null, return false");
				return false;
			}
			for (var i = 0, len = this.points.length - 2; i < len; i += 2) {
				var x = this.points[i] + this.x;
				var y = this.points[i + 1] + this.y;

				if (astr.hasPoint(x, y)) {
					return true;
				}
			}
			return false;
		},
		
		/**
		 * Returns whether ship's tractorbeam is colliding with object
		 *
		 * @param  {obj} object to test
		 * @return {Boolean}       result from test
		 */
		tractorbeam: function (obj) {
			if ( this.drawTractorbeam == true) {
				// don't test if not visible or if the object no longer exists, bullet destroyed it etc
				if (!this.visible || obj == null) {
					console.log("Tractor beam func beam returned false because testable object was null or ship was not visible.");
					return false;
				}
				if (obj.hasPoint(this.tractorbeamX, this.tractorbeamY)) {
					return obj;
				}
			}
			return false;
		},

		/**
		 * Create and return bullet with arguments from current
		 * direction and position
		 *
		 * @return {Bullet} the initated bullet
		 */
		shoot: function () {
			this.ammo--;
			var b = new Bullet(this.points[0] + this.x, this.points[1] + this.y, this.angle);
			b.maxX = this.maxX;
			b.maxY = this.maxY;
			return b;
		},

		shoot2: function () {
			this.ammo--;
			var b = new Bullet(this.points[0] + this.x, this.points[1] + this.y, this.angle + this.angleshift);
			//angle of bullets changes
			this.angleshift = Math.random() - 0.4
				this.angleshift *= Math.floor(Math.random() * 2) == 1 ? 1 : -1; // 50% chance of minus sign
			b.maxX = this.maxX;
			b.maxY = this.maxY;
			return b;
		},

		/**
		 * Update the velocity of the bullet depending on facing
		 * direction
		 */
		addVel: function () {
			// length of velocity vector estimated with pythagoras
			// theorem, i.e. a*a + b*b = c*c
			if (this.vel.x * this.vel.x + this.vel.y * this.vel.y < 20 * 20) {
				this.vel.x += this.acceleration * Math.cos(this.angle);
				this.vel.y += this.acceleration * Math.sin(this.angle);
				//Limit the max speed
				if(this.vel.x > this.maxvel){
					this.vel.x = this.maxvel
				}
				else if(this.vel.x < -this.maxvel){
					this.vel.x = -this.maxvel
				}
				if(this.vel.y > this.maxvel){
					this.vel.y = this.maxvel
				}
				else if(this.vel.y < -this.maxvel){
					this.vel.y = -this.maxvel
				}
			}
			this.drawFlames = true;
			this.fuel -= 0.01;
		},

		/**
		 * Rotate the ship and flame polygon clockwise
		 *
		 * @param  {number} theta angle to rotate with
		 *
		 * @override Polygon.rotate
		 */
		rotate: function (theta) {
			this._super(theta);
			this.flames.rotate(theta);
			this.angle += theta;
		},

		/**
		 * Decrease velocity and update ship position
		 */
		update: function () {
			//update cooldown
			this.fireCooldown++;

			// update position
			this.x += this.vel.x;
			this.y += this.vel.y;

			this.vel.x *= 0.995;
			this.vel.y *= 0.995;

			//ship falls by its gravity and weight of carried object
			if (this.visible) {
				if (this.carryingObject) {
					this.vel.y += this.gravity + this.weight;
				}
				else {
					this.vel.y += this.gravity;
				}
			}
			
			dx = this.tractorbeamX - this.x
			dy = this.tractorbeamY - this.y
			var distance = Math.sqrt(dx * dx + dy * dy);
			if (distance > this.tractorbeamLength){
				var dxl = dx * ( 1 - this.tractorbeamLength / distance )
				var dyl = dy * ( 1 - this.tractorbeamLength / distance )
				this.tractorbeamX -= dxl
				this.tractorbeamY -= dyl
			}
			//Apply gravity to tractorbeam
			if (this.carryingObject) {
				this.tractorbeamY += this.tractorbeamGravity + this.weight;
			}
			else {
				this.tractorbeamY += this.tractorbeamGravity
			}
		},
		/**
		 * Draw the ship with an augmented drawing context
		 *
		 * @param  {context2d} ctx augmented drawing context
		 */
		draw: function (ctx) {
			if (!this.visible) {
				return;
			}
			ctx.drawPolygon(this, this.x, this.y);
			if (this.drawFlames) {//draw the flames if engine on
				ctx.strokeStyle = 'red';
				ctx.drawPolygon(this.flames, this.x, this.y);
				this.drawFlames = false;
			}
			if (this.drawTractorbeam) {//draw tractorbeam if on
				ctx.strokeStyle = 'white';
				ctx.beginPath();
				ctx.moveTo(this.x, this.y);
				ctx.lineTo(this.tractorbeamX, this.tractorbeamY);
				ctx.stroke();
			}
			
		}
	});
