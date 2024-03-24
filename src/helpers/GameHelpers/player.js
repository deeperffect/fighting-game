export class Player {
	constructor({ position, width, height, color, velocity, facingDirection, commandMap }) {
		this.position = position;
		this.width = width;
		this.height = height;
		this.color = color;
		this.velocity = velocity;
		this.isJumping = false;
		this.isMoving = false;
		this.facingDirection = facingDirection;
		this.previousPosition = position;
		this.isGrounded = false;
		this.groundLevel = 500;
		this.commandMap = commandMap;
		this.movingDirection = null;
		this.diagonalJump = false;
	}

	draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
	}

	update(ctx, canvas) {
		this.draw(ctx);
		this.playerFeet = this.position.y + this.height;
		this.isGrounded = this.playerFeet === this.groundLevel;
		//movement
		this.position.y += this.velocity.y;
		this.position.x += this.velocity.x;
		//horizontal limit
		if (this.position.x + this.width >= canvas.width) {
			this.position.x = canvas.width - this.width;
		}
		if (this.position.x < 1) {
			this.position.x = 0;
		}
		//vertical limit
		if (this.playerFeet > this.groundLevel) {
			this.velocity.y = 0;
		}
		if (this.playerFeet > this.groundLevel) {
			this.position.y = this.groundLevel - this.height;
			this.isGrounded = true;
		}
		//jumping
		if (this.isJumping && this.position.y < 100) {
			this.velocity.y = 20;
			this.isJumping = false;
			this.diagonalJump = false;
		}
		if (this.isGrounded && !this.isMoving) {
			this.velocity.x = 0;
		}
	}

	playerControls(code, keyState) {
		const pressedMap = {
			down: {
				moveLeft: () => {
					if (this.isGrounded) this.movingDirection = 'left';
					command.pressed = true;
					this.isMoving = true;
				},
				moveRight: () => {
					if (this.isGrounded) this.movingDirection = 'right';
					command.pressed = true;
					this.isMoving = true;
				},
				jump: () => {
					command.pressed = true;
					if (this.isGrounded) {
						this.isJumping = true;
						this.isGrounded = false;
						if (this.isMoving) {
							this.diagonalJump = true;
						}
					}
				}
			},
			up: {
				moveLeft: () => {
					command.pressed = false;
					this.isMoving = false;
					this.movingDirection = null;
				},
				moveRight: () => {
					command.pressed = false;
					this.isMoving = false;
					this.movingDirection = null;
				},
				jump: () => {
					command.pressed = false;
				}
			}
		};
		//key commands
		const allowedKeys = this.commandMap.map(command => command.keyCode);
		if (!allowedKeys.includes(code)) return;
		const command = this.commandMap.find(command => command.keyCode === code);
		pressedMap[keyState][command.command]();
		//moving
		const velocityMap = {
			left: -7,
			right: 10
		};
		if (this.isMoving && this.movingDirection) {
			this.velocity.x = velocityMap[this.movingDirection];
		} else {
			if (!this.diagonalJump) this.velocity.x = 0;
		}
		//jumping
		if (this.isJumping) {
			this.velocity.y = -15;
			if (this.diagonalJump && this.movingDirection) {
				this.velocity.x = velocityMap[this.movingDirection];
			}
		}
	}
}
