function myMenuFunction() {
  const menuBtn = document.getElementById("myNavMenu");

  menuBtn.classList.toggle("responsive");
  document.body.classList.toggle("menu-open", menuBtn.classList.contains("responsive"));
}

function closeMobileMenu() {
  const menuBtn = document.getElementById("myNavMenu");

  if (!menuBtn) return;

  menuBtn.classList.remove("responsive");
  document.body.classList.remove("menu-open");
}

window.onscroll = function () {
  headerShadow();
};

function headerShadow() {
  const navHeader = document.getElementById("header");

  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    navHeader.style.boxShadow = "0 1px 6px rgba(0, 0, 0, 0.1)";
    navHeader.style.height = "70px";
    navHeader.style.lineHeight = "70px";
  } else {
    navHeader.style.boxShadow = "none";
    navHeader.style.height = "90px";
    navHeader.style.lineHeight = "90px";
  }
}

if (window.Typed) {
  new Typed(".typedText", {
    strings: ["Software Developer", "Flutter Developer", "Mobile App Developer"],
    loop: true,
    typeSpeed: 100,
    backSpeed: 80,
    backDelay: 2000,
  });
}

if (window.ScrollReveal) {
  const sr = ScrollReveal({
    origin: "top",
    distance: "60px",
    duration: 1100,
    reset: false,
  });

  sr.reveal(".featured-text-card", {});
  sr.reveal(".featured-name", { delay: 100 });
  sr.reveal(".featured-text-info", { delay: 200 });
  sr.reveal(".featured-text-btn", { delay: 200 });
  sr.reveal(".social_icons", { delay: 200 });
  sr.reveal(".featured-image", { delay: 300 });
  sr.reveal(".project-box", { interval: 120 });
  sr.reveal(".project-card", { interval: 120 });
  sr.reveal(".top-header", {});

  const srLeft = ScrollReveal({
    origin: "left",
    distance: "60px",
    duration: 1100,
    reset: false,
  });

  srLeft.reveal(".about-info", { delay: 100 });
  srLeft.reveal(".contact-info", { delay: 100 });

  const srRight = ScrollReveal({
    origin: "right",
    distance: "60px",
    duration: 1100,
    reset: false,
  });

  srRight.reveal(".skills-box", { delay: 100 });
  srRight.reveal(".form-control", { delay: 100 });
}

const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.scrollY;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 80;
    const sectionId = current.getAttribute("id");
    const navLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

    if (!navLink) return;

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLink.classList.add("active-link");
    } else {
      navLink.classList.remove("active-link");
    }
  });
}

window.addEventListener("scroll", scrollActive);

document.querySelectorAll(".nav-menu a, .footer-menu a, .scroll-btn").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    closeMobileMenu();
  }
});

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const sendButton = document.getElementById("sendButton");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const payload = {
      name: formData.get("name")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      message: formData.get("message")?.toString().trim(),
    };

    formStatus.textContent = "Sending message...";
    formStatus.className = "form-status";
    sendButton.disabled = true;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Message could not be sent.");
      }

      contactForm.reset();
      formStatus.textContent = "Message sent successfully.";
      formStatus.className = "form-status success";
    } catch (error) {
      formStatus.textContent = error.message || "Message could not be sent.";
      formStatus.className = "form-status error";
    } finally {
      sendButton.disabled = false;
    }
  });
}
