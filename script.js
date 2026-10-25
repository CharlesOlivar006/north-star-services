
"use strict";

// =========================================
// NORTHSTAR HOME SERVICES
// JavaScript interactions
// =========================================


// 1. MOBILE NAVIGATION
// Open and close the menu on smaller screens.

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", function () {
    const isOpen = navMenu.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  // Close the menu after a navigation link is selected.
  navMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      menuToggle.textContent = "☰";
    });
  });

  // Close the mobile menu if the window becomes desktop-sized.
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 768) {
      navMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      menuToggle.textContent = "☰";
    }
  });
}


// 2. SAMPLE QUOTE CALCULATOR
// These are fictional demonstration prices, not real quotes.

const estimateForm = document.getElementById("estimate-form");

const serviceType = document.getElementById("service-type");
const propertySize = document.getElementById("property-size");
const frequency = document.getElementById("frequency");

const estimatePrice = document.getElementById("estimate-price");
const estimateDescription = document.getElementById("estimate-description");

const summaryService = document.getElementById("summary-service");
const summarySize = document.getElementById("summary-size");
const summaryFrequency = document.getElementById("summary-frequency");


// Sample price ranges for each service.
// All amounts are fictional USD values for the portfolio demo.

const servicePrices = {
  cleaning: {
    name: "Home cleaning",
    small: [100, 140],
    medium: [180, 240],
    large: [280, 380]
  },

  repairs: {
    name: "Minor repairs",
    small: [90, 130],
    medium: [150, 220],
    large: [230, 320]
  },

  maintenance: {
    name: "Home upkeep",
    small: [80, 120],
    medium: [140, 200],
    large: [220, 300]
  },

  movein: {
    name: "Move-in refresh",
    small: [160, 220],
    medium: [260, 350],
    large: [400, 550]
  }
};


// Human-readable labels for the property sizes.

const sizeLabels = {
  small: "Small home / apartment",
  medium: "Medium home",
  large: "Large home"
};


// Format a number as a USD amount.

function formatPrice(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}


// Calculate the price and update the page.

function calculateEstimate() {
  const selectedService = serviceType.value;
  const selectedSize = propertySize.value;
  const selectedFrequency = frequency.value;

  const service = servicePrices[selectedService];

  // Stop if a valid service was not selected.
  if (!service || !service[selectedSize]) {
    return;
  }

  let minimum = service[selectedSize][0];
  let maximum = service[selectedSize][1];

  // Example discount for a recurring monthly service.
  // This is only a fictional pricing rule.
  if (selectedFrequency === "monthly") {
    minimum = Math.round(minimum * 0.9);
    maximum = Math.round(maximum * 0.9);
  }

  // Display the calculated price range.
  estimatePrice.textContent =
    formatPrice(minimum) + "–" + formatPrice(maximum);

  // Update the estimate description.
  estimateDescription.textContent =
    "A sample estimate for " +
    service.name.toLowerCase() +
    " for a " +
    sizeLabels[selectedSize].toLowerCase() +
    (selectedFrequency === "monthly"
      ? ", with an illustrative 10% recurring-service discount."
      : ".");

  // Update the estimate summary.
  summaryService.textContent = service.name;
  summarySize.textContent = sizeLabels[selectedSize];

  summaryFrequency.textContent =
    selectedFrequency === "monthly"
      ? "Monthly (sample discount)"
      : "One-time";
}


// Calculate when the visitor submits the calculator.

if (estimateForm) {
  estimateForm.addEventListener("submit", function (event) {
    event.preventDefault();
    calculateEstimate();
  });

  // Show an updated sample estimate whenever a selection changes.
  [serviceType, propertySize, frequency].forEach(function (field) {
    field.addEventListener("change", calculateEstimate);
  });

  // Display a valid initial estimate when the page loads.
  calculateEstimate();
}


// 3. SERVICE CARD BUTTONS
// Clicking a service card takes the visitor to the calculator
// and automatically selects that service.

const serviceButtons = document.querySelectorAll(".service-select");

serviceButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const chosenService = button.dataset.service;

    if (servicePrices[chosenService] && serviceType) {
      serviceType.value = chosenService;
      calculateEstimate();

      document.getElementById("estimate").scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth"
      });
    }
  });
});


// 4. SCROLL-REVEAL ANIMATIONS
// Elements fade in as they enter the visitor's viewport.

const revealElements = document.querySelectorAll(".reveal");

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach(function (element) {
    revealObserver.observe(element);
  });
} else {
  // Fallback for browsers without IntersectionObserver,
  // and for visitors who prefer reduced motion.
  revealElements.forEach(function (element) {
    element.classList.add("is-visible");
  });
}


// 5. DEMO CONTACT FORM
// Validates the form, but does NOT send or save any information.

const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

if (contactForm && formMessage) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Ask the browser to check required fields and input formats.
    if (!contactForm.reportValidity()) {
      return;
    }

    const customerName = document
      .getElementById("customer-name")
      .value.trim();

    // Display a demo confirmation without transmitting any information.
    formMessage.textContent =
      "Thanks, " +
      customerName +
      "! Your demo form passed validation. No message was sent or saved.";

    formMessage.setAttribute("role", "status");
  });
}


// 6. UPDATE THE FOOTER YEAR IF NEEDED
// This project currently uses a simple static footer, so no
// additional JavaScript is required for the footer.
