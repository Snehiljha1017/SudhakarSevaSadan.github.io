const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const revealItems = document.querySelectorAll(".reveal");
const bookingForm = document.querySelector("#appointment-form");
const bookingMessage = document.querySelector("#booking-message");
const preferredTimeSelect = document.querySelector("#preferred-time");
const whatsappNumbers = ["917011366767", "918210728218"];
const clinicTimeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM"
];

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (preferredTimeSelect) {
  clinicTimeSlots.forEach((slot) => {
    const option = document.createElement("option");
    option.value = slot;
    option.textContent = slot;
    preferredTimeSelect.appendChild(option);
  });
}

function buildWhatsappUrls(messageText) {
  return whatsappNumbers.map((number) => `https://wa.me/${number}?text=${encodeURIComponent(messageText)}`);
}

function openWhatsappChats(messageText) {
  buildWhatsappUrls(messageText).forEach((url) => {
    window.open(url, "_blank", "noopener");
  });
}

document.querySelectorAll("a.whatsapp").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const linkUrl = new URL(link.href, window.location.href);
    const fallbackMessage = "Hello Doctor, I want to book an appointment.";
    const messageText = linkUrl.searchParams.get("text")
      ? decodeURIComponent(linkUrl.searchParams.get("text"))
      : fallbackMessage;

    openWhatsappChats(messageText);
  });
});

if (bookingForm && bookingMessage) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(bookingForm);
    const name = String(formData.get("name") || "Patient").trim();
    const phone = String(formData.get("phone") || "").trim();
    const date = String(formData.get("date") || "").trim();
    const time = String(formData.get("time") || "").trim();
    const reason = String(formData.get("reason") || "").trim();
    const selectedDate = date ? new Date(`${date}T00:00:00`) : null;

    if (selectedDate && selectedDate.getDay() === 0) {
      bookingMessage.textContent = "Clinic is closed on Sunday. Please choose another date.";
      return;
    }

    if (!clinicTimeSlots.includes(time)) {
      bookingMessage.textContent = "Please choose a time during clinic hours.";
      return;
    }

    const displayDate = date || "the selected date";
    const displayTime = time || "the selected time";
    const whatsappText = [
      "Hello Doctor, I want to book an appointment.",
      `I would like to book an appointment.`,
      `Name: ${name}`,
      `Phone: ${phone || "Not provided"}`,
      `Date: ${displayDate}`,
      `Time: ${displayTime}`,
      `Reason: ${reason || "Not provided"}`
    ].join("\n");

    bookingMessage.textContent = `Opening WhatsApp chats for ${name}'s appointment request...`;
    openWhatsappChats(whatsappText);
  });
}
