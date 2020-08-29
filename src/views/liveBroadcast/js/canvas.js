export default {
	methods: {
		drawRect(ctx, x, y, width, height, borderWidth, borderColor, deviationX, deviationY) {
			ctx.beginPath();
			ctx.moveTo(x + deviationX, y + deviationY);
			ctx.lineTo(width + x, y + deviationY);
			ctx.lineTo(width + x, height + y + deviationY);
			ctx.lineTo(x + deviationX, height + y + deviationY);
			ctx.closePath();
			ctx.lineWidth = borderWidth;
			ctx.strokeStyle = borderColor;
			ctx.stroke();
		},
		// x坐标，y坐标, w宽度, deviationX x轴偏移, deviationY y轴偏移, text需要绘制的文字, color 字体颜色, font 字体样式
		drawText(ctx, x, y, w, deviationX, deviationY, text, color, font) {
			// 绘制文字
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.font = font;
			ctx.textAlign = "center";
			ctx.fillText(text, x + deviationX, y + deviationY, w);
			ctx.stroke();
			ctx.closePath();
		}
	}
};
