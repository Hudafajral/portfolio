document.addEventListener("DOMContentLoaded", () => {
  const sectionIds = ["start", "about", "skill", "experience", "lab", "contact"];
  let currentIndex = 0;
  let isScrolling = false;

  const spaceNodes = document.querySelectorAll(".space-nav .nav-node");
  const sectionPanels = document.querySelectorAll(".section-panel");
  const timelineScroll = document.getElementById("timelineScroll");

  const menuBtn = document.getElementById("menuBtn");
  const closeBtn = document.getElementById("closeBtn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const mobileNavLinks = document.querySelectorAll(".sidebar-menu a");

  const openContactForm = document.getElementById("openContactForm");
  const closeContactForm = document.getElementById("closeContactForm");
  const contactModal = document.getElementById("contactModal");
  const topContactTrigger = document.getElementById("topContactTrigger");

  const contactForm = document.getElementById("contactForm");
  const formSuccessState = document.getElementById("formSuccessState");

  // Inisialisasi EmailJS
  if (typeof emailjs !== "undefined") {
    emailjs.init("FT17KAeY1dnGE0B0m");
  }

  // FUNGSI GANTI SECTION HALUS
  function goToSection(index) {
    if (index < 0 || index >= sectionIds.length) return;
    currentIndex = index;
    const targetId = sectionIds[currentIndex];

    spaceNodes.forEach(node => {
      node.classList.remove("active");
      if (node.getAttribute("data-target") === targetId) {
        node.classList.add("active");
      }
    });

    sectionPanels.forEach(panel => {
      panel.classList.remove("active");
      if (panel.getAttribute("id") === targetId) {
        panel.classList.add("active");
      }
    });

    setTimeout(() => {
      isScrolling = false;
    }, 700);
  }

  // EVENT MOUSE WHEEL
  window.addEventListener("wheel", (e) => {
    if (window.innerWidth <= 1100) return;

    if (sectionIds[currentIndex] === "experience" && timelineScroll) {
      const isOverTimeline = timelineScroll.contains(e.target);
      if (isOverTimeline) {
        const atTop = timelineScroll.scrollTop <= 0;
        const atBottom = timelineScroll.scrollTop + timelineScroll.clientHeight >= timelineScroll.scrollHeight - 2;

        if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) {
          return;
        }
      }
    }

    if (isScrolling) return;

    if (e.deltaY > 30) {
      if (currentIndex < sectionIds.length - 1) {
        isScrolling = true;
        goToSection(currentIndex + 1);
      }
    } else if (e.deltaY < -30) {
      if (currentIndex > 0) {
        isScrolling = true;
        goToSection(currentIndex - 1);
      }
    }
  }, { passive: true });

  // NAVIGASI KEYBOARD
  window.addEventListener("keydown", (e) => {
    if (window.innerWidth <= 1100 || isScrolling) return;

    if (e.key === "ArrowDown" || e.key === "PageDown") {
      if (currentIndex < sectionIds.length - 1) {
        isScrolling = true;
        goToSection(currentIndex + 1);
      }
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      if (currentIndex > 0) {
        isScrolling = true;
        goToSection(currentIndex - 1);
      }
    }
  });

  // KLIK NAVBAR SISI KIRI
  spaceNodes.forEach((node) => {
    node.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = node.getAttribute("data-target");
      const targetIndex = sectionIds.indexOf(targetId);
      if (targetIndex !== -1 && targetIndex !== currentIndex) {
        isScrolling = true;
        goToSection(targetIndex);
      }
    });
  });

  // TOMBOL HERO "See My Projects"
  const heroBtn = document.querySelector(".hero-btn-pill");
  if (heroBtn) {
    heroBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const labIndex = sectionIds.indexOf("lab");
      if (labIndex !== -1) {
        isScrolling = true;
        goToSection(labIndex);
      }
    });
  }

  // TRIGGER TOMBOL "Contact Me" KANAN ATAS
  if (topContactTrigger) {
    topContactTrigger.addEventListener("click", (e) => {
      if (window.innerWidth > 1100) {
        e.preventDefault();
        const contactIndex = sectionIds.indexOf("contact");
        if (contactIndex !== -1) {
          isScrolling = true;
          goToSection(contactIndex);
        }
      }
    });
  }

  // ========================================================
  // LAB 3D CYLINDRICAL CAROUSEL LOGIC
  // ========================================================
  const labCards = document.querySelectorAll(".lab-card");
  const labPrevBtn = document.getElementById("labPrevBtn");
  const labNextBtn = document.getElementById("labNextBtn");
  const carouselDotsContainer = document.getElementById("carouselDots");
  let activeCardIndex = 0;

  if (carouselDotsContainer && labCards.length > 0) {
    carouselDotsContainer.innerHTML = "";
    labCards.forEach((_, idx) => {
      const dot = document.createElement("span");
      dot.classList.add("c-dot");
      if (idx === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        activeCardIndex = idx;
        updateLabCarousel();
      });
      carouselDotsContainer.appendChild(dot);
    });
  }

  function updateLabCarousel() {
    const total = labCards.length;
    const dots = document.querySelectorAll(".c-dot");

    labCards.forEach((card, i) => {
      card.classList.remove("prev", "active", "next", "hidden");

      if (i === activeCardIndex) {
        card.classList.add("active");
      } else if (i === (activeCardIndex - 1 + total) % total) {
        card.classList.add("prev");
      } else if (i === (activeCardIndex + 1) % total) {
        card.classList.add("next");
      } else {
        card.classList.add("hidden");
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === activeCardIndex);
    });
  }

  if (labNextBtn && labPrevBtn) {
    labNextBtn.addEventListener("click", () => {
      activeCardIndex = (activeCardIndex + 1) % labCards.length;
      updateLabCarousel();
    });

    labPrevBtn.addEventListener("click", () => {
      activeCardIndex = (activeCardIndex - 1 + labCards.length) % labCards.length;
      updateLabCarousel();
    });

    labCards.forEach((card, idx) => {
      card.addEventListener("click", () => {
        if (activeCardIndex !== idx) {
          activeCardIndex = idx;
          updateLabCarousel();
        }
      });
    });

    updateLabCarousel();
  }

  // DRAWER MOBILE
  function openSidebar() {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  }

  function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  }

  if (menuBtn) menuBtn.addEventListener("click", openSidebar);
  if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
  if (overlay) overlay.addEventListener("click", closeSidebar);

  mobileNavLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("data-target");
      const targetIndex = sectionIds.indexOf(targetId);
      if (window.innerWidth <= 1100) {
        closeSidebar();
      } else {
        e.preventDefault();
        if (targetIndex !== -1) goToSection(targetIndex);
        closeSidebar();
      }
    });
  });

  // ANIMASI MENGETIK (Typing Effect)
  const words = ["Intelligent Systems.", "AI-Powered Solutions.", "data into decisions."];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingElement = document.querySelector(".typing-text");

  function typeEffect() {
    if (!typingElement) return;

    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 400;
    }

    setTimeout(typeEffect, typeSpeed);
  }

  typeEffect();

  // ========================================================
  // SINGLE-CARD CONTACT FORM MODAL
  // ========================================================
  function openModal() {
    contactModal.classList.add("active");
    if (contactForm) contactForm.style.display = "flex";
    if (formSuccessState) formSuccessState.style.display = "none";
  }

  function closeModal() {
    contactModal.classList.remove("active");
  }

  if (openContactForm) openContactForm.addEventListener("click", openModal);
  if (closeContactForm) closeContactForm.addEventListener("click", closeModal);

  if (contactModal) {
    contactModal.addEventListener("click", (e) => {
      if (e.target === contactModal) closeModal();
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const from_name = document.getElementById("from_name").value.trim();
      const from_email = document.getElementById("from_email").value.trim();
      const interest = document.getElementById("interest").value;
      const message = document.getElementById("message").value.trim();
      const submitBtn = document.getElementById("sendEmailBtn");

      submitBtn.innerHTML = `<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>`;
      submitBtn.disabled = true;

      emailjs.send("service_ioi3srj", "template_k42fvjq", {
        from_name,
        from_email,
        interest,
        message
      })
      .then(() => {
        contactForm.reset();
        contactForm.style.display = "none";
        formSuccessState.style.display = "block";
        submitBtn.innerHTML = `<span>Kirim Pesan</span> <i class="fas fa-paper-plane"></i>`;
        submitBtn.disabled = false;
      })
      .catch((error) => {
        console.error("FAILED...", error);
        alert("Gagal mengirim pesan: " + JSON.stringify(error));
        submitBtn.innerHTML = `<span>Kirim Pesan</span> <i class="fas fa-paper-plane"></i>`;
        submitBtn.disabled = false;
      });
    });
  }
});