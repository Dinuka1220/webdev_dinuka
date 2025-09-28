import React, { useEffect, useRef, createElement } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
    const heroRef = useRef(null);
    const circleRef1 = useRef(null);
    const circleRef2 = useRef(null);
    const circleRef3 = useRef(null);
    const imageRef = useRef(null);
    const buttonContainerRef = useRef(null);

    // Button Component
    const Button = ({
                        children,
                        variant = 'primary',
                        size = 'md',
                        className = '',
                        onClick,
                        type = 'button',
                        ripple = true,
                    }) => {
        const buttonRef = useRef(null);

        const baseStyles = 'relative font-medium rounded-lg transition-all duration-300 inline-flex items-center justify-center overflow-hidden';

        const sizeStyles = {
            sm: 'px-4 py-1.5 text-sm',
            md: 'px-6 py-2.5 text-base',
            lg: 'px-8 py-3.5 text-lg',
        };

        const variantStyles = {
            primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl',
            secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 shadow-lg hover:shadow-xl',
            outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
        };

        const handleRippleEffect = (e) => {
            if (!ripple || !buttonRef.current) return;

            const button = buttonRef.current;
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rippleElement = document.createElement('span');
            rippleElement.style.position = 'absolute';
            rippleElement.style.width = '0px';
            rippleElement.style.height = '0px';
            rippleElement.style.left = `${x}px`;
            rippleElement.style.top = `${y}px`;
            rippleElement.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
            rippleElement.style.borderRadius = '50%';
            rippleElement.style.transform = 'translate(-50%, -50%)';
            rippleElement.style.animation = 'ripple 0.6s linear';

            button.appendChild(rippleElement);

            setTimeout(() => {
                rippleElement.remove();
            }, 600);
        };

        useEffect(() => {
            if (!document.getElementById('ripple-animation')) {
                const style = document.createElement('style');
                style.id = 'ripple-animation';
                style.textContent = `
          @keyframes ripple {
            0% {
              width: 0px;
              height: 0px;
              opacity: 0.6;
            }
            100% {
              width: 500px;
              height: 500px;
              opacity: 0;
            }
          }
          @keyframes shine {
            0% {
              left: -100%;
            }
            100% {
              left: 100%;
            }
          }
        `;
                document.head.appendChild(style);
            }
        }, []);

        return (
            <button
                ref={buttonRef}
                type={type}
                className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className} group`}
                onClick={(e) => {
                    handleRippleEffect(e);
                    if (onClick) onClick();
                }}
            >
                {children}
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-lg">
                    <div className="absolute -left-full top-0 w-1/2 h-full transform skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shine"></div>
                </div>
            </button>
        );
    };

    // AnimatedText Component
    const AnimatedText = ({
                              text,
                              tag = 'div',
                              className = '',
                              staggerTime = 0.03,
                              duration = 0.5,
                              delay = 0,
                          }) => {
        const textRef = useRef(null);
        const words = text.split(' ');

        useEffect(() => {
            const element = textRef.current;
            if (!element) return;

            const wordSpans = element.querySelectorAll('.word');

            const tl = gsap.timeline();
            tl.fromTo(
                wordSpans,
                {
                    y: 50,
                    opacity: 0,
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: duration,
                    stagger: staggerTime,
                    ease: 'power3.out',
                    delay: delay,
                }
            );

            return () => {
                tl.kill();
            };
        }, [text, staggerTime, duration, delay]);

        const Tag = tag;

        return createElement(
            Tag,
            {
                ref: textRef,
                className,
            },
            words.map((word, i) => (
                <span key={i} className="word inline-block mr-2">
          {word}
        </span>
            )),
        );
    };

    // FloatingElements Component
    const FloatingElements = ({
                                  count = 10,
                                  minSize = 20,
                                  maxSize = 60,
                                  colors = ['blue-300', 'indigo-300', 'purple-300'],
                                  className = '',
                              }) => {
        const containerRef = useRef(null);

        useEffect(() => {
            const container = containerRef.current;
            if (!container) return;

            const elements = container.querySelectorAll('.floating-element');

            elements.forEach((element) => {
                const randomX = gsap.utils.random(-50, 50);
                const randomY = gsap.utils.random(-50, 50);
                const randomDuration = gsap.utils.random(10, 20);

                gsap.to(element, {
                    x: randomX,
                    y: randomY,
                    duration: randomDuration,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: gsap.utils.random(0, 5),
                });
            });

            return () => {
                gsap.killTweensOf(elements);
            };
        }, []);

        return (
            <div
                ref={containerRef}
                className={`absolute inset-0 overflow-hidden ${className}`}
            >
                {Array.from({ length: count }).map((_, index) => {
                    const randomSize = Math.floor(minSize + Math.random() * (maxSize - minSize));
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];

                    return (
                        <div
                            key={index}
                            className={`floating-element absolute rounded-full bg-${randomColor} opacity-20 blur-lg`}
                            style={{
                                width: `${randomSize}px`,
                                height: `${randomSize}px`,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                        />
                    );
                })}
            </div>
        );
    };

    // ParallaxLayer Component
    const ParallaxLayer = ({
                               children,
                               speed = 0.2,
                               className = '',
                           }) => {
        const layerRef = useRef(null);

        useEffect(() => {
            const layer = layerRef.current;
            if (!layer) return;

            gsap.to(layer, {
                yPercent: -speed * 50,
                ease: 'none',
                scrollTrigger: {
                    trigger: layer,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            return () => {
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            };
        }, [speed]);

        return (
            <div ref={layerRef} className={className}>
                {children}
            </div>
        );
    };

    // Main HeroSection useEffect
    useEffect(() => {
        const tl = gsap.timeline();

        // Animate hero content
        tl.from('.hero-title', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
        });

        // Animate hero image
        if (imageRef.current) {
            tl.from(
                imageRef.current,
                {
                    x: 100,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out',
                },
                '-=0.6'
            );
        }

        // Animate buttons with bounce effect
        if (buttonContainerRef.current) {
            tl.from(
                buttonContainerRef.current.children,
                {
                    y: 30,
                    opacity: 0,
                    duration: 0.7,
                    stagger: 0.15,
                    ease: 'back.out(1.7)',
                },
                '-=0.4'
            );
        }

        // Animate floating circles
        const circles = [circleRef1.current, circleRef2.current, circleRef3.current];
        circles.forEach((circle, index) => {
            if (circle) {
                gsap.to(circle, {
                    x: `random(-${20 + index * 10}, ${20 + index * 10})`,
                    y: `random(-${20 + index * 10}, ${20 + index * 10})`,
                    duration: `random(${10 + index * 5}, ${15 + index * 5})`,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                });
            }
        });

        // Create animated particles
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle) => {
            gsap.to(particle, {
                x: gsap.utils.random(-50, 50),
                y: gsap.utils.random(-50, 50),
                opacity: gsap.utils.random(0.2, 0.6),
                scale: gsap.utils.random(0.8, 1.2),
                duration: gsap.utils.random(15, 25),
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: gsap.utils.random(0, 5),
            });
        });

        // Mouse movement parallax effect
        const handleMouseMove = (e) => {
            if (!heroRef.current) return;

            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 20;
            const yPos = (clientY / window.innerHeight - 0.5) * 20;

            gsap.to(circleRef1.current, {
                x: xPos * 0.5,
                y: yPos * 0.5,
                duration: 1,
                ease: 'power1.out',
            });

            gsap.to(circleRef2.current, {
                x: -xPos * 0.7,
                y: -yPos * 0.7,
                duration: 1,
                ease: 'power1.out',
            });

            gsap.to(circleRef3.current, {
                x: xPos * 0.3,
                y: -yPos * 0.3,
                duration: 1,
                ease: 'power1.out',
            });
        };

        const currentHeroRef = heroRef.current;
        if (currentHeroRef) {
            currentHeroRef.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            if (currentHeroRef) {
                currentHeroRef.removeEventListener('mousemove', handleMouseMove);
            }
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-100"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                {/* Animated Particles */}
                <ParallaxLayer speed={0.1} className="absolute inset-0 overflow-hidden">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="particle absolute rounded-full bg-blue-400/20 blur-xl"
                            style={{
                                width: `${Math.random() * 40 + 10}px`,
                                height: `${Math.random() * 40 + 10}px`,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                opacity: Math.random() * 0.3,
                            }}
                        />
                    ))}
                </ParallaxLayer>

                {/* Floating Circles */}
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        ref={circleRef1}
                        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-400/10 blur-3xl"
                    />
                    <div
                        ref={circleRef2}
                        className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-indigo-400/10 blur-3xl"
                    />
                    <div
                        ref={circleRef3}
                        className="absolute top-2/3 left-2/3 w-80 h-80 rounded-full bg-purple-400/10 blur-3xl"
                    />
                </div>

                {/* Additional Floating Elements */}
                <FloatingElements />
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="max-w-2xl">
                        <div className="hero-title mb-8">
                            <AnimatedText
                                text="Crafting Digital Experiences That Inspire"
                                tag="h1"
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
                                staggerTime={0.03}
                                duration={0.8}
                                delay={0.2}
                            />
                            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mt-6 rounded-full transform origin-left animate-underline" />
                        </div>

                        <p className="text-xl text-gray-600 mb-8 leading-relaxed animate-fadeIn">
                            We build stunning websites and powerful applications that drive
                            business growth and deliver exceptional user experiences.
                        </p>

                        <div ref={buttonContainerRef} className="flex flex-wrap gap-4">
                            <Button
                                variant="primary"
                                size="lg"
                                className="transform hover:scale-105 transition-transform duration-300"
                            >
                                Get Started
                            </Button>
                            <Button
                                variant="secondary"
                                size="lg"
                                className="transform hover:scale-105 transition-transform duration-300"
                            >
                                View Our Work
                            </Button>
                        </div>
                    </div>

                    {/* Image Content */}
                    <div ref={imageRef} className="lg:block hidden">
                        <div className="relative">
                            {/* Background Decorations */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl transform rotate-3 animate-pulse" />
                            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl transform -rotate-3 animate-pulse delay-1000" />

                            {/* Main Image Container */}
                            <div className="relative z-10 overflow-hidden rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
                                <img
                                    src="https://images.unsplash.com/photo-1581472723648-909f4851d4ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                                    alt="Modern web development"
                                    className="w-full h-auto object-cover"
                                />

                                {/* Image Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent" />

                                {/* Animated Border */}
                                <div className="absolute inset-0 border-2 border-blue-400/30 rounded-xl">
                                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-400 rounded-tl-lg animate-ping" />
                                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-400 rounded-tr-lg animate-ping" />
                                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-400 rounded-bl-lg animate-ping" />
                                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-400 rounded-br-lg animate-ping" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
        @keyframes underline {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-underline {
          animation: underline 1s ease-out forwards;
          animation-delay: 1s;
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
          animation-delay: 0.5s;
        }
      `}</style>
        </section>
    );
};

export default HeroSection;