document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initStickyHeader();
    initPaymentMethods();
    initFileUpload();
    initFormValidation();
    initSmoothScrolling();
    initDepartmentTabs();
    initFAQAccordion();
    initScrollAnimations();
    initActiveNavLinks();
});

// Mobile Navigation Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// Sticky Header on Scroll
function initStickyHeader() {
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        });
    }
}

// Payment Method Selection
function initPaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    const bankDetails = document.getElementById('bankDetails');
    
    if (paymentMethods.length && bankDetails) {
        paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                // Remove active class from all methods
                paymentMethods.forEach(m => m.classList.remove('active'));
                
                // Add active class to clicked method
                method.classList.add('active');
                
                // Show bank details if bank transfer selected
                if (method.dataset.method === 'bank') {
                    bankDetails.classList.add('active');
                } else {
                    bankDetails.classList.remove('active');
                }
            });
        });
        
        // Initialize with bank transfer selected by default
        document.querySelector('.payment-method[data-method="bank"]')?.click();
    }
}

// File Upload Display
function initFileUpload() {
    const paymentProof = document.getElementById('paymentProof');
    const fileDisplay = document.getElementById('fileDisplay');
    const fileName = document.getElementById('fileName');
    const removeFile = document.getElementById('removeFile');

    if (paymentProof && fileDisplay && fileName && removeFile) {
        paymentProof.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                fileName.textContent = this.files[0].name;
                fileDisplay.style.display = 'flex';
            }
        });

        removeFile.addEventListener('click', function() {
            paymentProof.value = '';
            fileDisplay.style.display = 'none';
        });
    }
}

// Form Validation and Submission
function initFormValidation() {
    const admissionForm = document.getElementById('admissionForm');
    const contactForm = document.getElementById('contactForm');
    
    if (admissionForm) {
        admissionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            const requiredFields = admissionForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value) {
                    field.style.borderColor = 'var(--error)';
                    isValid = false;
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // In a real application, you would send the form data to a server
            console.log('Form submitted:', {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                // Add all other form fields
            });
            
            // Show success message
            alert('Thank you for your application! We will review your information and contact you soon.');
            
            // Reset form
            admissionForm.reset();
            const fileDisplay = document.getElementById('fileDisplay');
            if (fileDisplay) fileDisplay.style.display = 'none';
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value) {
                    field.style.borderColor = 'var(--error)';
                    isValid = false;
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // In a real application, you would send the form data to a server
            console.log('Contact form submitted:', {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                // Add all other form fields
            });
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.getElementById('header')?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }
        });
    });
}

// Department Tabs for Academics Page
function initDepartmentTabs() {
    const departmentTabs = document.querySelectorAll('.department-tab');
    const departmentContents = document.querySelectorAll('.department-content');
    
    if (departmentTabs.length && departmentContents.length) {
        departmentTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                departmentTabs.forEach(t => t.classList.remove('active'));
                departmentContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding content
                const department = tab.dataset.department;
                const content = document.getElementById(`${department}-content`);
                if (content) content.classList.add('active');
            });
        });
        
        // Activate first tab by default
        departmentTabs[0]?.click();
    }
}

// FAQ Accordion for Admissions Page
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const toggle = question.querySelector('.faq-toggle');
                
                // Toggle answer visibility
                answer.classList.toggle('active');
                
                // Update toggle icon
                if (answer.classList.contains('active')) {
                    toggle.textContent = '-';
                } else {
                    toggle.textContent = '+';
                }
            });
        });
    }
}

// Scroll Animations for Sections
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    
    if (sections.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
}

// Highlight Active Navigation Links
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (sections.length && navLinks.length) {
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const headerHeight = document.getElementById('header')?.offsetHeight || 80;
                
                if (window.scrollY >= (sectionTop - headerHeight - 50)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}` || 
                    link.getAttribute('href').includes(current)) {
                    link.classList.add('active');
                }
            });
        });
    }
}



