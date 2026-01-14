document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 2. Smooth Section Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Staggered Entrance Animation (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, observerOptions);

    const revealItems = document.querySelectorAll('.reveal-item');
    revealItems.forEach((item) => {
        observer.observe(item);
    });

    // 4. Form Submission Logic
    const bookingForm = document.getElementById('booking-form');
    const formResponse = document.getElementById('form-response');

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = bookingForm.querySelector('button');
            const originalText = submitBtn.innerText;

            // UI State: Submitting
            submitBtn.innerText = 'Transmitting Request...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;

            const formData = new FormData(bookingForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // Pointing to the Vibe Backend
                const response = await fetch('http://localhost:3000/api/book', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    formResponse.style.color = '#8E735B';
                    formResponse.innerText = result.message;
                    bookingForm.reset();
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                formResponse.style.color = '#A64B4B';
                formResponse.innerText = 'Our digital lines are busy. Please call us at (303) 555-0123.';
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
            }
        });
    }
});
