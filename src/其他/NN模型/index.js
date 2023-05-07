/**
 * !info {Project} -来自网络
 */



// 一元线性回归
// _a, _b 	—— 需求的参数值
// xi, yi 	—— 样本数组
// _step 	—— 步长设置
// _inaccuracy —— 最大误差
function gradient_descent(_a, _b, xi, yi, _step, _inaccuracy) {
	let a = _a	//设置初始值
	let	b = _b	//设置初始值
	const step = _step					// 定义步长
	const inaccuracy = _inaccuracy		// 定义最大误差
	let count = 400						// 最大迭代次数，防止无限循环
	while (count--){
		let grad_a = Ja(a, b, xi, yi) * step
		let grad_b = Jb(a, b, xi, yi) * step
		a = a - grad_a
		b = b - grad_b
        console.log(a);
		let cost = J(a, b, xi, yi)	// 代价函数
		console.log('cost:'+cost, 'a:'+a, 'b:'+b)
		if(Math.abs(grad_a) < inaccuracy && Math.abs(grad_b) < inaccuracy){
			console.log('count:'+count)
			return [a, b]
		}
		old_cost = cost
	}
	console.log('count:'+count)
	return [a, b]
}
// 代价函数
function J(a, b, xi, yi) {
	const number = xi.length
	let sum = 0
	for(let i = 0; i < number; i++){
		sum = sum + (a*xi[i]+b-yi[i]) * (a*xi[i]+b-yi[i])
	}
	return sum/2
}
// 对 J 求 a 的偏导
function Ja(a, b, xi, yi) {
	const number = xi.length
	let sum = 0
	for(let i = 0; i < number; i++){
		sum = sum + (a*xi[i]+b-yi[i])*xi[i]
	}
	return sum
}
// 对 J 求 b 的偏导
function Jb(a, b, xi, yi) {
	const number = xi.length
	let sum = 0
	for(let i = 0; i < number; i++){
		sum = sum + a*xi[i]+b-yi[i]
	}
	return sum
}

// 测试
const xi = [1,2,3,4,5,9, ]
const yi = [1,3,2,4,5,7, ]
console.log(gradient_descent(0, 0, xi, yi, 0.01, 0.01))
