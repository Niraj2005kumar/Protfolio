/* ==========================================================================
   AI Portfolio JS Logic - Niraj Verma
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Theme Manager
  initThemeManager();

  // Loading Screen progress & reveal
  initLoader();

  // Custom Smooth Trailing Cursor
  initCustomCursor();

  // Particle Canvas Background
  initParticleCanvas();

  // Hero Section Typing Effect
  initTypingEffect();

  // Intersection Observer for scroll triggers
  initScrollObserver();

  // 3D Card Hover Tilt Effects
  initCardTilts();

  // Contact Form Handling
  initContactForm();

  // Back to Top and Navbar scroll behaviors
  initScrollBehaviors();
});

/* ==========================================================================
   Theme Management (Light / Dark Mode)
   ========================================================================== */
function initThemeManager() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const currentTheme = localStorage.getItem('theme') || 'dark';
  
  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
  } else {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
    
    const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
  });
}

/* ==========================================================================
   Loading Screen Progress Bar
   ========================================================================== */
function initLoader() {
  const loader = document.getElementById('loading-screen');
  const progress = document.getElementById('loader-progress');
  if (!loader || !progress) return;

  let width = 0;
  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('fade-out');
        document.body.classList.add('loaded');
      }, 500);
    } else {
      width += Math.floor(Math.random() * 15) + 5;
      if (width > 100) width = 100;
      progress.style.width = width + '%';
    }
  }, 100);
}

/* ==========================================================================
   Custom Trailing Glow Cursor
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  if (!cursor || !cursorDot) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  bindCursorHoverEvents();
}

function bindCursorHoverEvents() {
  const hoverables = document.querySelectorAll('a, button, .social-icon, .project-card, .certificate-card, .skill-tag-pill, .premium-timeline-item, .about-card');
  hoverables.forEach(el => {
    el.removeEventListener('mouseenter', hoverIn);
    el.removeEventListener('mouseleave', hoverOut);
    
    el.addEventListener('mouseenter', hoverIn);
    el.addEventListener('mouseleave', hoverOut);
  });
}

const hoverIn = () => document.body.classList.add('cursor-hover');
const hoverOut = () => document.body.classList.remove('cursor-hover');

/* ==========================================================================
   Neural/Stars Background Canvas Particles (Crimson Red Accents)
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  let mouse = { x: null, y: null, radius: 120 };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius + this.size) {
          if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
            this.x += 2;
          }
          if (mouse.x > this.x && this.x > this.size * 10) {
            this.x -= 2;
          }
          if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
            this.y += 2;
          }
          if (mouse.y > this.y && this.y > this.size * 10) {
            this.y -= 2;
          }
        }
      }

      this.x += this.directionX;
      this.y += this.directionY;
      this.draw();
    }
  }

  function initParticles() {
    particlesArray = [];
    const numberOfParticles = Math.floor((canvas.width * canvas.height) / 12000);
    const themeColor = document.body.classList.contains('light-theme') ? 'rgba(204, 12, 34, 0.12)' : 'rgba(227, 18, 43, 0.18)';

    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 2) + 0.5;
      let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
      let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
      let directionX = (Math.random() * 0.4) - 0.2;
      let directionY = (Math.random() * 0.4) - 0.2;
      particlesArray.push(new Particle(x, y, directionX, directionY, size, themeColor));
    }
  }

  function connectParticles() {
    let opacityValue = 1;
    const theme = document.body.classList.contains('light-theme');
    
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 95) {
          opacityValue = 1 - (distance / 95);
          ctx.strokeStyle = theme 
            ? `rgba(204, 12, 34, ${opacityValue * 0.06})`
            : `rgba(227, 18, 43, ${opacityValue * 0.11})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();

  const observer = new MutationObserver(() => {
    initParticles();
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}

/* ==========================================================================
   Hero Section Text Typing Animation
   ========================================================================== */
function initTypingEffect(customWords = null) {
  const textEl = document.getElementById('typing-text');
  if (!textEl) return null;

  const defaultWords = ['AI Engineer', 'Python Developer', 'Full Stack Developer', 'Freelancer'];
  const words = customWords && customWords.length > 0 ? customWords : defaultWords;
  
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;
  let timerId = null;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      textEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      textEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 1500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }

    timerId = setTimeout(type, typeSpeed);
  }

  // Clear previous typing instances if re-initializing
  textEl.textContent = "";
  
  const timeoutId = setTimeout(type, 1000);

  return {
    stop: () => {
      clearTimeout(timerId);
      clearTimeout(timeoutId);
    }
  };
}



/* ==========================================================================
   Scroll reveal (AOS alternative) & skill progress triggers
   ========================================================================== */
function initScrollObserver() {
  const elements = document.querySelectorAll('.reveal-fade, .reveal-slide-up, .reveal-slide-right');
  
  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
        
        if (entry.target.id === 'skills') {
          triggerSkillBars();
        }
        if (entry.target.id === 'achievements') {
          triggerCounters();
        }
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => scrollObserver.observe(el));

  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= (sectionTop - 120)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

function triggerSkillBars() {
  const skills = document.querySelectorAll('.skill-item');
  skills.forEach(skill => {
    const bar = skill.querySelector('.skill-bar-inner');
    const percentEl = skill.querySelector('.skill-percentage');
    const targetVal = parseInt(percentEl.getAttribute('data-val'));
    const widthVal = bar.getAttribute('data-width');
    
    if (bar) bar.style.width = widthVal;

    let currentCount = 0;
    const counterInterval = setInterval(() => {
      if (currentCount >= targetVal) {
        if (percentEl) percentEl.textContent = targetVal + '%';
        clearInterval(counterInterval);
      } else {
        currentCount++;
        if (percentEl) percentEl.textContent = currentCount + '%';
      }
    }, 15);
  });
}

function triggerCounters() {
  const counters = document.querySelectorAll('.stat-numberCount');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 1800;
    const stepTime = Math.max(Math.floor(duration / target), 10);
    
    let current = 0;
    const stepIncrement = Math.ceil(target / (duration / stepTime));

    const timer = setInterval(() => {
      current += stepIncrement;
      if (current >= target) {
        counter.textContent = target.toLocaleString('en-US');
        clearInterval(timer);
      } else {
        counter.textContent = current.toLocaleString('en-US');
      }
    }, stepTime);
  });
}

/* ==========================================================================
   3D Tilt Animations for Premium Hover UX
   ========================================================================== */
function initCardTilts() {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    card.removeEventListener('mousemove', handleTiltMove);
    card.removeEventListener('mouseleave', handleTiltLeave);
    
    card.addEventListener('mousemove', handleTiltMove);
    card.addEventListener('mouseleave', handleTiltLeave);
  });
}

function handleTiltMove(e) {
  const card = e.currentTarget;
  const cardRect = card.getBoundingClientRect();
  const cardWidth = cardRect.width;
  const cardHeight = cardRect.height;
  
  const mouseX = e.clientX - cardRect.left - (cardWidth / 2);
  const mouseY = e.clientY - cardRect.top - (cardHeight / 2);
  
  const rotateY = (mouseX / (cardWidth / 2)) * 8;
  const rotateX = -(mouseY / (cardHeight / 2)) * 8;

  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
  card.style.transition = 'none';
}

function handleTiltLeave(e) {
  const card = e.currentTarget;
  card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0deg)';
  card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
}

/* ==========================================================================
   Contact Form Validation & Submission Actions
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    const name = document.getElementById('form-name');
    const email = document.getElementById('form-email');
    const subject = document.getElementById('form-subject');
    const message = document.getElementById('form-message');

    if (!name.value.trim()) {
      name.closest('.form-group').classList.add('invalid');
      isValid = false;
    } else {
      name.closest('.form-group').classList.remove('invalid');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      email.closest('.form-group').classList.add('invalid');
      isValid = false;
    } else {
      email.closest('.form-group').classList.remove('invalid');
    }

    if (!subject.value.trim()) {
      subject.closest('.form-group').classList.add('invalid');
      isValid = false;
    } else {
      subject.closest('.form-group').classList.remove('invalid');
    }

    if (!message.value.trim()) {
      message.closest('.form-group').classList.add('invalid');
      isValid = false;
    } else {
      message.closest('.form-group').classList.remove('invalid');
    }

    if (isValid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHtml = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;
      
      const payload = {
        name: name.value.trim(),
        email: email.value.trim(),
        subject: subject.value.trim(),
        message: message.value.trim(),
        timestamp: Date.now()
      };

      try {
        // Send the visitor's message to the portfolio email inbox.
        const emailResponse = await fetch('https://formsubmit.co/ajax/nirajverma075@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: payload.name,
            email: payload.email,
            subject: payload.subject,
            message: payload.message,
            _subject: `Portfolio contact: ${payload.subject}`,
            _template: 'table',
            _captcha: 'false'
          })
        });

        if (!emailResponse.ok) {
          throw new Error(`Email delivery failed with status ${emailResponse.status}`);
        }



        feedback.className = 'form-feedback-message success';
        feedback.textContent = 'Thank you! Your message has been sent successfully.';
        form.reset();
        
        setTimeout(() => {
          feedback.style.display = 'none';
        }, 5000);

      } catch (err) {
        console.error("Form submit error: ", err);
        feedback.className = 'form-feedback-message error';
        feedback.textContent = 'Failed to submit form. Please check network connection or try again later.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHtml;
      }
    } else {
      feedback.className = 'form-feedback-message error';
      feedback.textContent = 'Please correct the highlighted errors before submitting.';
    }
  });

  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      input.closest('.form-group').classList.remove('invalid');
    });
  });
}

/* ==========================================================================
   Smooth Scrolling & Back-to-Top Toggle
   ========================================================================== */
function initScrollBehaviors() {
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTop.style.opacity = '1';
      backToTop.style.visibility = 'visible';
      backToTop.style.transform = 'translateY(0)';
    } else {
      backToTop.style.opacity = '0';
      backToTop.style.visibility = 'hidden';
      backToTop.style.transform = 'translateY(10px)';
    }
  });

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
    });
    
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }
}
