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

  const nextButtons = document.querySelectorAll(".next-btn");
  const backButtons = document.querySelectorAll(".back-btn");
  const sendEmailBtn = document.getElementById("sendEmailBtn");
  const formSteps = document.querySelectorAll(".form-step");

  // Inisialisasi EmailJS
  if (typeof emailjs !== "undefined") {
    emailjs.init("FT17KAeY1dnGE0B0m");
  }

  // FUNGSI GANTI SECTION HALUS
  function goToSection(index) {
    if (index < 0 || index >= sectionIds.length) return;
    currentIndex = index;
    const targetId = sectionIds[currentIndex];

    // Update Nav Node Kiri
    spaceNodes.forEach(node => {
      node.classList.remove("active");
      if (node.getAttribute("data-target") === targetId) {
        node.classList.add("active");
      }
    });

    // Update Tampilan Panel
    sectionPanels.forEach(panel => {
      panel.classList.remove("active");
      if (panel.getAttribute("id") === targetId) {
        panel.classList.add("active");
      }
    });

    // Beri jeda debounce 700ms agar putaran wheel tidak membuat halaman loncat-loncat
    setTimeout(() => {
      isScrolling = false;
    }, 700);
  }

  // EVENT MOUSE WHEEL KONTROL SCROLL BEBAS MENTAL
  window.addEventListener("wheel", (e) => {
    if (window.innerWidth <= 1100) return; // Mode normal di layar HP

    // Cek apakah kursor berada di dalam kotak Timeline Experience
    if (sectionIds[currentIndex] === "experience" && timelineScroll) {
      const isOverTimeline = timelineScroll.contains(e.target);
      if (isOverTimeline) {
        const atTop = timelineScroll.scrollTop <= 0;
        const atBottom = timelineScroll.scrollTop + timelineScroll.clientHeight >= timelineScroll.scrollHeight - 2;

        // Jika belum mentok di dalam timeline, biarkan scroll kotaknya saja
        if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) {
          return;
        }
      }
    }

    if (isScrolling) return;

    if (e.deltaY > 30) {
      // Putar mouse wheel ke bawah -> pindah ke section berikutnya
      if (currentIndex < sectionIds.length - 1) {
        isScrolling = true;
        goToSection(currentIndex + 1);
      }
    } else if (e.deltaY < -30) {
      // Putar mouse wheel ke atas -> pindah ke section sebelumnya
      if (currentIndex > 0) {
        isScrolling = true;
        goToSection(currentIndex - 1);
      }
    }
  }, { passive: true });

  // NAVIGASI TOMBOL KEYBOARD (Arrow Down / Up)
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

  // LINK INTERNAL (Tombol "See My Projects")
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
  const words = ["Data Systems.", "AI Solutions.", "Web Applications.", "FastAPI Backends."];
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

  // MODAL CONTACT FORM WIZARD
  function showStep(stepId) {
    formSteps.forEach(step => step.classList.remove("active"));
    const targetStep = document.getElementById(stepId);
    if (targetStep) targetStep.classList.add("active");
  }

  function openModal() {
    contactModal.classList.add("active");
    showStep("step1");
  }

  function closeModal() {
    contactModal.classList.remove("active");
    showStep("step1");
  }

  if (openContactForm) openContactForm.addEventListener("click", openModal);
  if (closeContactForm) closeContactForm.addEventListener("click", closeModal);

  if (contactModal) {
    contactModal.addEventListener("click", e => {
      if (e.target === contactModal) closeModal();
    });
  }

  nextButtons.forEach(button => {
    button.addEventListener("click", () => {
      const nextStep = button.dataset.next;
      if (nextStep === "step2") {
        const name = document.getElementById("from_name").value.trim();
        if (!name) return alert("Please enter your name.");
      }
      if (nextStep === "step3") {
        const email = document.getElementById("from_email").value.trim();
        if (!email) return alert("Please enter your email.");
      }
      if (nextStep === "step4") {
        const interest = document.getElementById("interest").value;
        if (!interest) return alert("Please select your interest.");
      }
      showStep(nextStep);
    });
  });

  backButtons.forEach(button => {
    button.addEventListener("click", () => {
      showStep(button.dataset.back);
    });
  });

  if (sendEmailBtn) {
    sendEmailBtn.addEventListener("click", () => {
      const from_name = document.getElementById("from_name").value.trim();
      const from_email = document.getElementById("from_email").value.trim();
      const interest = document.getElementById("interest").value;
      const message = document.getElementById("message").value.trim();

      if (!message) return alert("Please enter your message.");

      sendEmailBtn.innerText = "Sending...";
      sendEmailBtn.disabled = true;

      emailjs.send("service_ioi3srj", "template_k42fvjq", {
        from_name,
        from_email,
        interest,
        message
      })
      .then(() => {
        sendEmailBtn.innerText = "Send Message →";
        sendEmailBtn.disabled = false;
        document.getElementById("from_name").value = "";
        document.getElementById("from_email").value = "";
        document.getElementById("interest").value = "";
        document.getElementById("message").value = "";
        showStep("successStep");
      })
      .catch(error => {
        console.error("FAILED...", error);
        alert("Failed to send message: " + error.text);
        sendEmailBtn.innerText = "Send Message →";
        sendEmailBtn.disabled = false;
      });
    });
  }
});
