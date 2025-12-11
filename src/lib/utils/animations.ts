import { gsap } from 'gsap';

/**
 * Staggered fade-in animation for list items
 */
export function staggerFadeIn(
	elements: HTMLElement[] | NodeListOf<Element>,
	options: { delay?: number; stagger?: number; duration?: number; y?: number } = {}
) {
	const { delay = 0, stagger = 0.05, duration = 0.4, y = 20 } = options;
	
	gsap.fromTo(
		elements,
		{ opacity: 0, y },
		{ 
			opacity: 1, 
			y: 0, 
			duration, 
			stagger, 
			delay,
			ease: 'power2.out' 
		}
	);
}

/**
 * Slide and fade transition for step changes
 */
export function slideTransition(
	element: HTMLElement,
	direction: 'in' | 'out',
	from: 'left' | 'right' = 'right'
) {
	const xValue = from === 'right' ? 30 : -30;
	
	if (direction === 'in') {
		gsap.fromTo(
			element,
			{ opacity: 0, x: xValue },
			{ opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
		);
	} else {
		gsap.to(element, {
			opacity: 0,
			x: -xValue,
			duration: 0.3,
			ease: 'power2.in'
		});
	}
}

/**
 * Magnetic button hover effect
 */
export function createMagneticButton(button: HTMLElement) {
	const strength = 0.3;
	
	const handleMouseMove = (e: MouseEvent) => {
		const rect = button.getBoundingClientRect();
		const x = e.clientX - rect.left - rect.width / 2;
		const y = e.clientY - rect.top - rect.height / 2;
		
		gsap.to(button, {
			x: x * strength,
			y: y * strength,
			duration: 0.3,
			ease: 'power2.out'
		});
	};
	
	const handleMouseLeave = () => {
		gsap.to(button, {
			x: 0,
			y: 0,
			duration: 0.5,
			ease: 'elastic.out(1, 0.5)'
		});
	};
	
	button.addEventListener('mousemove', handleMouseMove);
	button.addEventListener('mouseleave', handleMouseLeave);
	
	// Return cleanup function
	return () => {
		button.removeEventListener('mousemove', handleMouseMove);
		button.removeEventListener('mouseleave', handleMouseLeave);
	};
}

/**
 * Button click ripple effect
 */
export function buttonClickEffect(button: HTMLElement) {
	gsap.fromTo(
		button,
		{ scale: 1 },
		{ 
			scale: 0.95, 
			duration: 0.1, 
			ease: 'power2.in',
			yoyo: true,
			repeat: 1
		}
	);
}

/**
 * Draw SVG checkmark animation
 */
export function drawCheckmark(svg: SVGElement) {
	const paths = svg.querySelectorAll('path, polyline, circle');
	
	paths.forEach((path) => {
		const length = (path as SVGGeometryElement).getTotalLength?.() || 100;
		gsap.set(path, {
			strokeDasharray: length,
			strokeDashoffset: length
		});
	});
	
	gsap.to(paths, {
		strokeDashoffset: 0,
		duration: 0.8,
		stagger: 0.2,
		ease: 'power2.inOut'
	});
}

/**
 * Pulse animation for loading states
 */
export function pulseAnimation(element: HTMLElement) {
	return gsap.to(element, {
		scale: 1.05,
		opacity: 0.8,
		duration: 0.6,
		ease: 'power1.inOut',
		yoyo: true,
		repeat: -1
	});
}

/**
 * Shake animation for errors
 */
export function shakeAnimation(element: HTMLElement) {
	gsap.fromTo(
		element,
		{ x: 0 },
		{
			x: [-10, 10, -8, 8, -5, 5, 0],
			duration: 0.5,
			ease: 'power2.out'
		}
	);
}

/**
 * Counter animation for numbers
 */
export function animateCounter(
	element: HTMLElement,
	endValue: number,
	duration: number = 1
) {
	const obj = { value: 0 };
	
	gsap.to(obj, {
		value: endValue,
		duration,
		ease: 'power2.out',
		onUpdate: () => {
			element.textContent = Math.round(obj.value).toString();
		}
	});
}

/**
 * Calendar day ripple entrance
 */
export function calendarRippleIn(
	days: HTMLElement[] | NodeListOf<Element>,
	centerIndex: number = 17 // Middle of 6x7 grid
) {
	const daysArray = Array.from(days);
	
	// Calculate distance from center for each day
	const cols = 7;
	daysArray.forEach((day, i) => {
		const row = Math.floor(i / cols);
		const col = i % cols;
		const centerRow = Math.floor(centerIndex / cols);
		const centerCol = centerIndex % cols;
		
		const distance = Math.sqrt(
			Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2)
		);
		
		gsap.fromTo(
			day,
			{ opacity: 0, scale: 0.5 },
			{
				opacity: 1,
				scale: 1,
				duration: 0.4,
				delay: distance * 0.03,
				ease: 'back.out(1.5)'
			}
		);
	});
}

/**
 * Form field focus animation
 */
export function fieldFocusAnimation(field: HTMLElement, focused: boolean) {
	if (focused) {
		gsap.to(field, {
			borderColor: '#667eea',
			boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.15)',
			duration: 0.3,
			ease: 'power2.out'
		});
	} else {
		gsap.to(field, {
			borderColor: '#e2e8f0',
			boxShadow: '0 0 0 0px rgba(102, 126, 234, 0)',
			duration: 0.3,
			ease: 'power2.out'
		});
	}
}

/**
 * Success celebration animation
 */
export function celebrationBurst(container: HTMLElement) {
	// Create temporary elements for burst effect
	const colors = ['#667eea', '#764ba2', '#10b981', '#fbbf24', '#f472b6'];
	const particles: HTMLElement[] = [];
	
	for (let i = 0; i < 20; i++) {
		const particle = document.createElement('div');
		particle.style.cssText = `
			position: absolute;
			width: 8px;
			height: 8px;
			background: ${colors[i % colors.length]};
			border-radius: 50%;
			top: 50%;
			left: 50%;
			pointer-events: none;
		`;
		container.appendChild(particle);
		particles.push(particle);
		
		const angle = (i / 20) * Math.PI * 2;
		const velocity = 100 + Math.random() * 100;
		
		gsap.to(particle, {
			x: Math.cos(angle) * velocity,
			y: Math.sin(angle) * velocity - 50,
			opacity: 0,
			scale: 0,
			duration: 1,
			ease: 'power2.out',
			onComplete: () => particle.remove()
		});
	}
}