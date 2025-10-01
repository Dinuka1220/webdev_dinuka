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
    const textContentRef = useRef(null);
    const imageContainerRef = useRef(null);

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
                                  colors = ['#93c5fd', '#a5b4fc', '#c4b5fd'],
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
                className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
                style={{ zIndex: 0 }}
            >
                {Array.from({ length: count }).map((_, index) => {
                    const randomSize = Math.floor(minSize + Math.random() * (maxSize - minSize));
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];

                    return (
                        <div
                            key={index}
                            className="floating-element absolute rounded-full opacity-20 blur-lg"
                            style={{
                                width: `${randomSize}px`,
                                height: `${randomSize}px`,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                backgroundColor: randomColor,
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
            <div ref={layerRef} className={`pointer-events-none ${className}`} style={{ zIndex: 0 }}>
                {children}
            </div>
        );
    };

    // Main HeroSection useEffect with separate animations for image section
    useEffect(() => {
        const tl = gsap.timeline();

        // Set initial states
        gsap.set(imageContainerRef.current, {
            rotationY: 15,
            scale: 0.8,
            opacity: 0,
            transformPerspective: 1000
        });

        // Image section animation - Different from text animation
        tl.to(imageContainerRef.current, {
            rotationY: 0,
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            delay: 0.3
        })
            .fromTo('.image-border-corner',
                {
                    scale: 0,
                    opacity: 0
                },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'back.out(1.7)'
                },
                '-=0.6'
            )
            .fromTo('.image-gradient-overlay',
                {
                    scaleX: 0,
                    transformOrigin: 'left center'
                },
                {
                    scaleX: 1,
                    duration: 0.8,
                    ease: 'power2.inOut'
                },
                '-=0.3'
            );

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
                    delay: 1.5 + index * 0.3,
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

        // Mouse movement parallax effect for image
        const handleMouseMove = (e) => {
            if (!heroRef.current) return;

            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 20;
            const yPos = (clientY / window.innerHeight - 0.5) * 20;

            // Parallax effect for circles
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

            // Subtle parallax for image container
            gsap.to(imageContainerRef.current, {
                x: xPos * 0.1,
                y: yPos * 0.1,
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
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-100 w-full"
            style={{ position: 'relative' }}
        >
            {/* Background Elements */}
            <div className="absolute inset-0" style={{ zIndex: 1 }}>
                <ParallaxLayer speed={0.1} className="absolute inset-0 overflow-hidden">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="particle absolute rounded-full bg-blue-400/20 blur-xl pointer-events-none"
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
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

                <FloatingElements />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 w-full relative" style={{ zIndex: 20 }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Text Content - Uses AnimatedText component */}
                    <div ref={textContentRef} className="max-w-2xl w-full text-center lg:text-left">
                        <div className="hero-title mb-6 lg:mb-8">
                            <AnimatedText
                                text="Crafting Digital Experiences That Inspire"
                                tag="h1"
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
                                staggerTime={0.03}
                                duration={0.8}
                                delay={0.2}
                            />
                            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mt-4 lg:mt-6 rounded-full transform origin-left animate-underline mx-auto lg:mx-0" />
                        </div>

                        <p className="text-lg sm:text-xl text-gray-600 mb-6 lg:mb-8 leading-relaxed animate-fadeIn">
                            We build stunning websites and powerful applications that drive
                            business growth and deliver exceptional user experiences.
                        </p>

                        <div ref={buttonContainerRef} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                            <Button
                                variant="primary"
                                size="lg"
                                className="transform hover:scale-105 transition-transform duration-300 w-full sm:w-auto"
                                onClick={() => console.log('Get Started clicked')}
                            >
                                Get Started
                            </Button>
                            <Button
                                variant="secondary"
                                size="lg"
                                className="transform hover:scale-105 transition-transform duration-300 w-full sm:w-auto"
                                onClick={() => console.log('View Our Work clicked')}
                            >
                                View Our Work
                            </Button>
                        </div>
                    </div>

                    {/* Image Content - Has its own unique animation */}
                    <div ref={imageRef} className="w-full flex justify-center lg:justify-end">
                        <div ref={imageContainerRef} className="relative max-w-lg w-full">
                            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl transform rotate-3 animate-pulse pointer-events-none" />
                            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl transform -rotate-3 animate-pulse delay-1000 pointer-events-none" />

                            {/* Main Image Container */}
                            <div className="relative z-10 overflow-hidden rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500 bg-white">
                                <img
                                    src="https://images.unsplash.com/photo-1581472723648-909f4851d4ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                                    alt="Modern web development"
                                    className="w-full h-auto object-cover"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzZjNzU3ZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                                    }}
                                />

                                <div className="image-gradient-overlay absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent pointer-events-none" />

                                {/* Animated Border */}
                                <div className="absolute inset-0 border-2 border-blue-400/30 rounded-xl pointer-events-none">
                                    <div className="image-border-corner absolute top-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-l-2 border-blue-400 rounded-tl-lg" />
                                    <div className="image-border-corner absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-r-2 border-blue-400 rounded-tr-lg" />
                                    <div className="image-border-corner absolute bottom-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-l-2 border-blue-400 rounded-bl-lg" />
                                    <div className="image-border-corner absolute bottom-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-r-2 border-blue-400 rounded-br-lg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Styles */}
            <style jsx global>{`
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

                /* Ensure proper stacking context */
                .relative {
                    position: relative;
                }
                .absolute {
                    position: absolute;
                }

                /* Fix for mobile responsiveness */
                @media (max-width: 640px) {
                    .hero-title h1 {
                        font-size: 2rem !important;
                        line-height: 1.2 !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default HeroSection;