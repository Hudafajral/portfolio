document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const closeBtn = document.getElementById("closeBtn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const navLinks = document.querySelectorAll(".sidebar-menu a");

  const openContactForm = document.getElementById("openContactForm");
  const closeContactForm = document.getElementById("closeContactForm");
  const contactModal = document.getElementById("contactModal");

  const nextButtons = document.querySelectorAll(".next-btn");
  const backButtons = document.querySelectorAll(".back-btn");
  const sendEmailBtn = document.getElementById("sendEmailBtn");
  const formSteps = document.querySelectorAll(".form-step");

  if (typeof emailjs !== "undefined") {
    emailjs.init("FT17KAeY1dnGE0B0m");
  } else {
    console.error("EmailJS belum terbaca. Pastikan script EmailJS ada sebelum script.js di index.html");
  }

  function openSidebar() {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  }

  function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  }

  function showStep(stepId) {
    formSteps.forEach(step => step.classList.remove("active"));
    document.getElementById(stepId).classList.add("active");
  }

  function openModal() {
    contactModal.classList.add("active");
    document.body.style.overflow = "hidden";
    showStep("step1");
  }

  function closeModal() {
    contactModal.classList.remove("active");
    document.body.style.overflow = "auto";
    showStep("step1");
  }

  menuBtn.addEventListener("click", openSidebar);
  closeBtn.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);

  openContactForm.addEventListener("click", openModal);
  closeContactForm.addEventListener("click", closeModal);

  contactModal.addEventListener("click", e => {
    if (e.target === contactModal) {
      closeModal();
    }
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navLinks.forEach(item => item.classList.remove("active"));
      link.classList.add("active");
      closeSidebar();
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeSidebar();
      closeModal();
    }
  });

  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    let current = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop;

      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");

      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

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
        alert(
            "Failed to send message.\n" +
            "Status: " + error.status + "\n" +
            "Text: " + error.text
        );
        sendEmailBtn.innerText = "Send Message →";
        sendEmailBtn.disabled = false;
    });
  });

  console.log("Portfolio + EmailJS Ready");
});