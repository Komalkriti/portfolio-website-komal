document.addEventListener("DOMContentLoaded", () => {
    // 1. Tab Switching Logic
    try {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const projectCards = document.querySelectorAll('.project-card');

        if (tabBtns.length > 0 && projectCards.length > 0) {
            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Update active tab button
                    tabBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const category = btn.textContent.toLowerCase().trim().includes('mobile') ? 'mobile' : 'web';

                    // Filter projects
                    projectCards.forEach(card => {
                        if (card.getAttribute('data-category') === category) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            });
        }
    } catch (err) {
        console.error("Error in tab switching logic:", err);
    }

    // 2. Hey There Section Interaction
    try {
        const heyThereWrapper = document.querySelector('.hey-there-wrapper');
        const floatContainer = document.querySelector('.float-container');
        const heyThereImg = document.querySelector('.hey-there-img');

        if (heyThereWrapper && heyThereImg) {
            // Intersection Observer / Reveal logic
            const checkReveal = () => {
                const rect = heyThereWrapper.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.85) {
                    heyThereWrapper.classList.add('revealed');
                    if (floatContainer) {
                        setTimeout(() => {
                            floatContainer.classList.add('active-float');
                        }, 1000);
                    }
                    window.removeEventListener('scroll', checkReveal);
                }
            };
            window.addEventListener('scroll', checkReveal);
            checkReveal(); // check immediately

            // Mouse Tilt Effect
            heyThereWrapper.addEventListener('mousemove', (e) => {
                const rect = heyThereWrapper.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 25;
                const rotateY = (centerX - x) / 25;

                if (floatContainer) {
                    floatContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }
            });

            heyThereWrapper.addEventListener('mouseleave', () => {
                if (floatContainer) {
                    floatContainer.style.transform = `rotateX(0deg) rotateY(0deg)`;
                }
            });

            // Click Squish Effect
            heyThereImg.addEventListener('click', () => {
                heyThereImg.style.transition = 'transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                heyThereImg.style.transform = 'scale(0.85, 1.15)';
                
                setTimeout(() => {
                    heyThereImg.style.transform = 'scale(1.1, 0.85)';
                    setTimeout(() => {
                        heyThereImg.style.transform = 'scale(1)';
                        // Restore original transition
                        setTimeout(() => {
                            heyThereImg.style.transition = 'opacity 1s ease, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        }, 100);
                    }, 100);
                }, 100);
            });
        }
    } catch (err) {
        console.error("Error in hey there section logic:", err);
    }

    // 3. Bubble Physics Interactions
    try {
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                initPhysics();
            });
        } else {
            setTimeout(initPhysics, 500);
        }
    } catch (err) {
        console.error("Error launching physics initialization:", err);
    }

    // 4. Slider Logics
    try {
        function setupSlider(sliderId, prevBtnId, nextBtnId, dotsContainerId) {
            const slider = document.getElementById(sliderId);
            if (!slider) return;

            const prevBtn = document.getElementById(prevBtnId);
            const nextBtn = document.getElementById(nextBtnId);
            const dots = document.querySelectorAll(dotsContainerId + ' .dot');

            const updateDots = () => {
                if (dots.length === 0) return;
                const index = Math.round(slider.scrollLeft / slider.clientWidth);
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            };

            slider.addEventListener('scroll', updateDots);

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    slider.scrollBy({ left: -slider.clientWidth, behavior: 'smooth' });
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    slider.scrollBy({ left: slider.clientWidth, behavior: 'smooth' });
                });
            }

            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    const index = parseInt(dot.getAttribute('data-index'));
                    if (!isNaN(index)) {
                        slider.scrollTo({ left: slider.clientWidth * index, behavior: 'smooth' });
                    }
                });
            });
        }

        setupSlider('persona-slider', 'persona-prev', 'persona-next', '#persona-dots');
        setupSlider('journey-slider', 'journey-prev', 'journey-next', '#journey-dots');
        setupSlider('flow-slider', 'flow-prev', 'flow-next', '#flow-dots');
        setupSlider('wireframe-slider', 'wireframe-prev', 'wireframe-next', '#wireframe-dots');
        setupSlider('design-slider', 'design-prev', 'design-next', '#design-dots');
        setupSlider('mockup-slider', 'mockup-prev', 'mockup-next', '#mockup-dots');

        // Add mouse swipe drag support for all slider containers
        document.querySelectorAll('.personas-slider').forEach(slider => {
            let isDown = false;
            let startX;
            let scrollLeft;

            slider.addEventListener('mousedown', (e) => {
                isDown = true;
                slider.style.cursor = 'grabbing';
                slider.style.userSelect = 'none';
                slider.style.scrollSnapType = 'none';
                slider.style.scrollBehavior = 'auto';
                startX = e.pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
            });

            slider.addEventListener('mouseleave', () => {
                if (isDown) {
                    isDown = false;
                    slider.style.cursor = 'grab';
                    slider.style.scrollSnapType = 'x mandatory';
                    slider.style.scrollBehavior = 'smooth';
                }
            });

            slider.addEventListener('mouseup', () => {
                if (isDown) {
                    isDown = false;
                    slider.style.cursor = 'grab';
                    slider.style.scrollSnapType = 'x mandatory';
                    slider.style.scrollBehavior = 'smooth';

                    // Snap to closest slide on release
                    const index = Math.round(slider.scrollLeft / slider.clientWidth);
                    slider.scrollTo({ left: slider.clientWidth * index, behavior: 'smooth' });
                }
            });

            slider.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - slider.offsetLeft;
                const walk = (x - startX) * 2;
                slider.scrollLeft = scrollLeft - walk;
            });

            slider.style.cursor = 'grab';
        });
    } catch (err) {
        console.error("Error setting up sliders:", err);
    }

    // 5. Side Navigation Scroll Tracking & Click
    try {
        const sideNavItems = document.querySelectorAll(".side-nav-item");
        const showcaseSections = document.querySelectorAll(".showcase-section");

        if (sideNavItems.length > 0 && showcaseSections.length > 0) {
            const trackScroll = () => {
                let currentId = "";
                showcaseSections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    // Section is intersecting if its top is near top of viewport
                    if (rect.top <= window.innerHeight * 0.35 && rect.bottom >= window.innerHeight * 0.15) {
                        currentId = section.getAttribute("id");
                    }
                });

                if (currentId) {
                    sideNavItems.forEach(item => {
                        item.classList.toggle("active", item.getAttribute("href") === `#${currentId}`);
                    });
                }
            };

            window.addEventListener("scroll", trackScroll);
            trackScroll(); // track initially

            sideNavItems.forEach(item => {
                item.addEventListener("click", (e) => {
                    const id = item.getAttribute("href").substring(1);
                    const targetSection = document.getElementById(id);
                    if (targetSection) {
                        e.preventDefault();
                        window.removeEventListener("scroll", trackScroll);

                        sideNavItems.forEach(nav => nav.classList.remove("active"));
                        item.classList.add("active");

                        const yOffset = -90; // header height offset
                        const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: "smooth" });

                        setTimeout(() => {
                            window.addEventListener("scroll", trackScroll);
                        }, 800);
                    }
                });
            });
        }
    } catch (err) {
        console.error("Error setting up side navigation:", err);
    }
});

function initPhysics() {
    try {
        if (typeof Matter === 'undefined') {
            console.warn('Matter.js is not loaded. Falling back to simple flex layout.');
            return;
        }

        const Engine = Matter.Engine,
              Runner = Matter.Runner,
              Bodies = Matter.Bodies,
              Composite = Matter.Composite,
              Mouse = Matter.Mouse,
              MouseConstraint = Matter.MouseConstraint,
              Events = Matter.Events;

        const container = document.getElementById('physics-container');
        const pills = document.querySelectorAll('.skill-pill');
        
        if (!container || pills.length === 0) return;

        // Create the physics engine
        const engine = Engine.create();
        
        // Zero gravity for floating balloon effect
        engine.world.gravity.y = 0;
        engine.world.gravity.x = 0;

        let width = container.clientWidth;
        let height = container.clientHeight;

        // Wall options
        const wallOptions = { 
            isStatic: true, 
            restitution: 0.8,
            friction: 0 
        };
        const thickness = 60;
        
        // Create boundaries
        const ground = Bodies.rectangle(width / 2, height + thickness / 2, width * 2, thickness, wallOptions);
        const leftWall = Bodies.rectangle(-thickness / 2, height / 2, thickness, height * 2, wallOptions);
        const rightWall = Bodies.rectangle(width + thickness / 2, height / 2, thickness, height * 2, wallOptions);
        const ceiling = Bodies.rectangle(width / 2, -thickness / 2, width * 2, thickness, wallOptions);

        Composite.add(engine.world, [ground, leftWall, rightWall, ceiling]);

        const bodyPillMap = [];

        // Create bodies for pills
        pills.forEach((pill) => {
            pill.style.top = '0px';
            pill.style.left = '0px';
            pill.style.transform = 'none';
            
            const rect = pill.getBoundingClientRect();
            const pWidth = rect.width || 120;
            const pHeight = rect.height || 45;

            // Random position in center
            const startX = width / 2 + (Math.random() - 0.5) * (width * 0.6);
            const startY = height / 2 + (Math.random() - 0.5) * (height * 0.6);

            // Safe chamfer radius to avoid crashes in Matter.js
            const minDimension = Math.min(pWidth, pHeight);
            const chamferRadius = Math.max(0, minDimension / 2 - 4);

            const body = Bodies.rectangle(startX, startY, pWidth, pHeight, {
                restitution: 0.9,
                friction: 0.1,
                frictionAir: 0.015,
                chamfer: { radius: chamferRadius },
                angle: (Math.random() - 0.5) * 0.5
            });

            Composite.add(engine.world, body);
            bodyPillMap.push({ body, domElement: pill, width: pWidth, height: pHeight });

            Matter.Body.applyForce(body, body.position, {
                x: (Math.random() - 0.5) * 0.015,
                y: (Math.random() - 0.5) * 0.015
            });
        });

        container.classList.add('physics-ready');

        const mouse = Mouse.create(container);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });

        Composite.add(engine.world, mouseConstraint);

        const dragColors = [
            { bg: '#4285F4', text: '#FFF' },
            { bg: '#E8D06A', text: '#000' },
            { bg: '#B2FAE6', text: '#000' },
            { bg: '#FF9A9E', text: '#000' },
            { bg: '#A18CD1', text: '#FFF' },
            { bg: '#FCE7B1', text: '#000' },
            { bg: '#FF7E67', text: '#FFF' },
            { bg: '#3A78FF', text: '#FFF' }
        ];

        Events.on(mouseConstraint, 'startdrag', function(event) {
            const body = event.body;
            if (body) {
                const mapping = bodyPillMap.find(m => m.body === body);
                if (mapping) {
                    const randomStyle = dragColors[Math.floor(Math.random() * dragColors.length)];
                    mapping.domElement.style.backgroundColor = randomStyle.bg;
                    mapping.domElement.style.borderColor = randomStyle.bg;
                    mapping.domElement.style.color = randomStyle.text;
                }
            }
        });

        mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
        mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

        Events.on(engine, 'afterUpdate', () => {
            bodyPillMap.forEach(({ body, domElement, width, height }) => {
                const x = body.position.x - width / 2;
                const y = body.position.y - height / 2;
                const angle = body.angle;
                
                domElement.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`;
            });
        });

        window.addEventListener('resize', () => {
            width = container.clientWidth;
            height = container.clientHeight;
            
            Matter.Body.setPosition(ground, { x: width / 2, y: height + thickness / 2 });
            Matter.Body.setPosition(rightWall, { x: width + thickness / 2, y: height / 2 });
            Matter.Body.setPosition(ceiling, { x: width / 2, y: -thickness / 2 });
        });

        Runner.run(Runner.create(), engine);
    } catch (err) {
        console.error("Error during initPhysics:", err);
    }
}
