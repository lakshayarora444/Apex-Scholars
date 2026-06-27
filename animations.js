/* -------------------------------------------------------------
   Apex Scholars User Interactions & Animations Script
   Powered by GSAP & ScrollTrigger.
   Handles theme switching, tabs, timelines, counters, FAQ
   accordions, forms, and carousels.
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 1. Premium Cursor Glow Effect
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        window.addEventListener('mousemove', (e) => {
            // Track cursor with delay or absolute position
            cursorGlow.style.opacity = '1';
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
        
        window.addEventListener('mouseout', () => {
            cursorGlow.style.opacity = '0';
        });
    }

    // 2. Light / Dark Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const cachedTheme = localStorage.getItem('apex-theme') || systemTheme;
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', cachedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Apply theme change
            document.documentElement.setAttribute('data-theme', nextTheme);
            localStorage.setItem('apex-theme', nextTheme);
            
            // Re-render lucide icons if color shifts
            setTimeout(() => {
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }, 100);
        });
    }

    // 3. Mobile Header & Scroll Actions
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.85rem 0';
            header.style.background = document.documentElement.getAttribute('data-theme') === 'dark' 
                ? 'rgba(3, 7, 18, 0.85)' 
                : 'rgba(255, 255, 255, 0.9)';
        } else {
            header.style.padding = '1.25rem 0';
            header.style.background = document.documentElement.getAttribute('data-theme') === 'dark' 
                ? 'rgba(3, 7, 18, 0.7)' 
                : 'rgba(255, 255, 255, 0.8)';
        }
    });

    // 4. Mobile Navigation Toggles
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const closeMobileMenu = document.querySelector('.close-mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileNavToggle && mobileMenuOverlay) {
        mobileNavToggle.addEventListener('click', () => {
            mobileMenuOverlay.classList.add('active');
        });
    }

    const hideMobileMenu = () => {
        if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
    };

    if (closeMobileMenu) {
        closeMobileMenu.addEventListener('click', hideMobileMenu);
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', hideMobileMenu);
    });

    // 5. Stat Counter Animations
    const runStatCounters = () => {
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const isFloat = target % 1 !== 0;
            const suffix = stat.innerText.includes('%') ? '%' : (stat.innerText.includes('+') ? '+' : '');
            
            let obj = { val: 0 };
            gsap.to(obj, {
                val: target,
                duration: 2.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                onUpdate: () => {
                    stat.innerText = isFloat 
                        ? obj.val.toFixed(1) + suffix
                        : Math.floor(obj.val) + suffix;
                }
            });
        });
    };
    runStatCounters();

    // 6. Section Scroll Entrance Reveals
    gsap.registerPlugin(ScrollTrigger);

    const revealSections = () => {
        // Hero texts reveal
        gsap.from('.hero-text-block > *', {
            y: 35,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power4.out'
        });

        // Hero stats reveal
        gsap.from('.hero-stats-banner', {
            opacity: 0,
            y: 40,
            duration: 1.2,
            delay: 0.5,
            ease: 'power3.out'
        });

        // About section grids reveal
        gsap.from('.about-text-block > *', {
            x: -40,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            scrollTrigger: {
                trigger: '.about-text-block',
                start: 'top 80%'
            }
        });

        gsap.from('.timeline-item', {
            opacity: 0,
            x: 40,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.timeline',
                start: 'top 80%'
            }
        });

        // Why choose cards grid reveal
        gsap.from('.why-us-section .feature-card', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.15,
            scrollTrigger: {
                trigger: '.why-us-section .grid-3',
                start: 'top 75%'
            }
        });

        // Founder section details reveal
        gsap.from('.founder-visual', {
            opacity: 0,
            scale: 0.95,
            duration: 1.2,
            scrollTrigger: {
                trigger: '.founder-section',
                start: 'top 75%'
            }
        });

        gsap.from('.founder-info-block > *', {
            opacity: 0,
            x: 35,
            duration: 0.8,
            stagger: 0.1,
            scrollTrigger: {
                trigger: '.founder-info-block',
                start: 'top 75%'
            }
        });
    };
    revealSections();

    // 7. Interactive Programs Tab Panels
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            // Deactivate existing
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // Activate target
            btn.classList.add('active');
            const targetPanel = document.getElementById(tabName);
            if (targetPanel) {
                targetPanel.classList.add('active');
                
                // Animate entrance of target children
                gsap.from(targetPanel.querySelectorAll('.program-info > *, .program-visual-mock > *'), {
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: 'power2.out'
                });
            }
        });
    });

    // Middle School Curriculum Sub-tabs
    const subTabItems = document.querySelectorAll('.sub-tab-item');
    const subPanels = document.querySelectorAll('.sub-panel');

    subTabItems.forEach(item => {
        item.addEventListener('click', () => {
            const subName = item.getAttribute('data-sub');
            
            subTabItems.forEach(t => t.classList.remove('active'));
            subPanels.forEach(p => p.classList.remove('active'));
            
            item.classList.add('active');
            const targetSub = document.getElementById(subName);
            if (targetSub) {
                targetSub.classList.add('active');
            }
        });
    });

    // 8. Learning Framework Step Selector Engine
    const stepsData = {
        "1": {
            title: "Diagnostic Assessment",
            lead: "Every scholar's journey begins with a multi-dimensional diagnostic process.",
            desc: "We do not just check correct answers. We record the student's cognitive steps, tracking how they arrive at conclusions, where their thinking stalls, and their resilience when facing novel, difficult challenges. Parents receive a detailed analysis report outlining exact diagnostic findings.",
            icon: "clipboard-list"
        },
        "2": {
            title: "Learning Profile Creation",
            lead: "Designing a blueprint that aligns with the child's academic and emotional self.",
            desc: "Using the assessment data, we establish a specialized cognitive profile. This profiles mathematical conceptual speed, spatial logic, linguistic vocabulary foundations, and key attention span intervals. Most importantly, we document their active personal interests (e.g., athletics, architecture, space) to customize learning materials.",
            icon: "fingerprint"
        },
        "3": {
            title: "Personalized Roadmap",
            lead: "A custom educational flightpath with measurable milestone achievements.",
            desc: "We generate a customized learning trajectory that details which concepts require rebuilding and which are ready for immediate acceleration. It establishes transparent 30-day, 60-day, and 90-day mastery goals, showing parents exactly what success looks like.",
            icon: "milestone"
        },
        "4": {
            title: "Weekly Active Instruction",
            lead: "Engaging individual sessions centered around conceptual discovery and mastery.",
            desc: "Scholars work with dedicated academic mentors using our active pedagogy framework. Instead of passively copying answers, students solve logic cards, design physics scenarios, build custom scratch logic programs, and explain math proofs aloud to ensure true retention.",
            icon: "calendar"
        },
        "5": {
            title: "Progress Analytics",
            lead: "Real-time metrics, STUDY streaks, and constant dashboard validation.",
            desc: "Every completed module records response speeds, accuracy curves, and focus marks on our client portal. Monthly diagnostic checkups verify that the student has retained the material and is ready to advance without leaving educational gaps.",
            icon: "bar-chart-3"
        },
        "6": {
            title: "Academic Growth & Acceleration",
            lead: "Transitioning past grade-level constraints to elite placement preps.",
            desc: "Once a scholar reaches base mastery, we boost rigor. We introduce advanced pre-placement academic material, prepare them for competitive placement exams, enter them into math/science contests, and guide them on independent STEM projects.",
            icon: "rocket"
        }
    };

    const frameworkSteps = document.querySelectorAll('.framework-step');
    const panelTarget = document.getElementById('framework-panel-target');

    frameworkSteps.forEach(step => {
        step.addEventListener('click', () => {
            const stepNum = step.getAttribute('data-step');
            
            // Deactivate all steps
            frameworkSteps.forEach(s => s.classList.remove('active'));
            // Activate selected
            step.classList.add('active');
            
            const data = stepsData[stepNum];
            if (data && panelTarget) {
                // Fade out panel first
                gsap.to(panelTarget, {
                    opacity: 0,
                    y: 10,
                    duration: 0.25,
                    onComplete: () => {
                        // Inject new details
                        panelTarget.innerHTML = `
                            <div class="panel-visual-graphic">
                                <div class="pulse-ring"></div>
                                <i data-lucide="${data.icon}" class="large-panel-icon"></i>
                            </div>
                            <div class="panel-text">
                                <h3>${data.title}</h3>
                                <p class="lead">${data.lead}</p>
                                <p>${data.desc}</p>
                            </div>
                        `;
                        
                        // Re-run lucide icons generator
                        if (typeof lucide !== 'undefined') lucide.createIcons();
                        
                        // Fade panel back in
                        gsap.to(panelTarget, {
                            opacity: 1,
                            y: 0,
                            duration: 0.35,
                            ease: 'power2.out'
                        });
                    }
                });
            }
        });
    });

    // 9. Success Metrics Chart Animation Trigger
    const mathPath = document.querySelector('.math-path');
    const stemPath = document.querySelector('.stem-path');

    if (mathPath && stemPath) {
        ScrollTrigger.create({
            trigger: '.metrics-visual-portal',
            start: 'top 80%',
            onEnter: () => {
                mathPath.style.animationPlayState = 'running';
                stemPath.style.animationPlayState = 'running';
            }
        });
    }

    // 10. Testimonials Carousel Engine
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const btnPrev = document.querySelector('.carousel-prev');
    const btnNext = document.querySelector('.carousel-next');
    let activeIndex = 0;
    let carouselTimer = null;

    const showSlide = (idx) => {
        // Boundary wrap checks
        if (idx >= slides.length) idx = 0;
        if (idx < 0) idx = slides.length - 1;
        
        slides.forEach((slide, sIdx) => {
            slide.classList.remove('active');
            dots[sIdx].classList.remove('active');
        });

        slides[idx].classList.add('active');
        dots[idx].classList.add('active');
        activeIndex = idx;
    };

    const nextSlide = () => showSlide(activeIndex + 1);
    const prevSlide = () => showSlide(activeIndex - 1);

    const resetTimer = () => {
        clearInterval(carouselTimer);
        carouselTimer = setInterval(nextSlide, 6500); // auto-rotate every 6.5s
    };

    if (btnPrev && btnNext) {
        btnNext.addEventListener('click', () => {
            nextSlide();
            resetTimer();
        });
        btnPrev.addEventListener('click', () => {
            prevSlide();
            resetTimer();
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            showSlide(index);
            resetTimer();
        });
    });

    // Start auto carousel
    resetTimer();

    // 11. FAQ Accordion Trigger
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const faqItem = trigger.parentElement;
            const faqContent = faqItem.querySelector('.faq-content');
            const isActive = faqItem.classList.contains('active');

            // Close all other accordions
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-content').style.maxHeight = null;
            });

            // Toggle selected
            if (!isActive) {
                faqItem.classList.add('active');
                faqContent.style.maxHeight = `${faqContent.scrollHeight}px`;
            }
        });
    });

    // 12. Consultation Lead Form Handler
    const consultationForm = document.getElementById('consultation-form');
    const successOverlay = document.querySelector('.form-success-overlay');
    const resetFormBtn = document.getElementById('btn-reset-form');

    if (consultationForm && successOverlay) {
        consultationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple premium visual success trigger
            gsap.to(consultationForm, {
                opacity: 0.1,
                y: -10,
                duration: 0.4,
                onComplete: () => {
                    successOverlay.classList.add('active');
                }
            });
        });
    }

    if (resetFormBtn && consultationForm && successOverlay) {
        resetFormBtn.addEventListener('click', () => {
            consultationForm.reset();
            successOverlay.classList.remove('active');
            gsap.to(consultationForm, {
                opacity: 1,
                y: 0,
                duration: 0.4
            });
        });
    }
});
