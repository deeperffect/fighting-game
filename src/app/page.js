'use client';
import { Player } from '@helpers/index';
import React, { useEffect, useRef } from 'react';

const Home = () => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		canvas.width = 1024;
		canvas.height = 576;
		const ctx = canvas.getContext('2d');
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		const player = new Player({
			position: {
				x: 0,
				y: 0
			},
			width: 50,
			height: 100,
			color: 'blue',
			velocity: {
				x: 0,
				y: 20
			},
			facingDirection: 'right',
			commandMap: [
				{
					command: 'moveLeft',
					keyCode: 'KeyA',
					pressed: false
				},
				{
					command: 'moveRight',
					keyCode: 'KeyD',
					pressed: false
				},
				{
					command: 'jump',
					keyCode: 'KeyW',
					pressed: false
				}
			]
		});

		function gameLoop() {
			window.requestAnimationFrame(gameLoop);
			ctx.fillStyle = 'black';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			player.update(ctx, canvas);
		}
		gameLoop();

		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('keyup', onKeyUp);
		function onKeyDown(e) {
			player.playerControls(e.code, 'down');
		}
		function onKeyUp(e) {
			player.playerControls(e.code, 'up');
		}
	}, []);

	return <canvas ref={canvasRef} width={canvasRef.width} height={canvasRef.height} />;
};

export default Home;
