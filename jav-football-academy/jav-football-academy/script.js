document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu
  var btn = document.querySelector(".menu-btn");
  var nav = document.getElementById("nav");
  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });

  // Highlight current page in the menu
  var page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach(function (a) {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Registration form
  var form = document.getElementById("reg-form");
  if (!form) return;
  var status = document.getElementById("status");

  function check(field) {
    var msg = "";
    if (!field.value.trim()) msg = "This field is required.";
    else if (field.type === "email" && !/^\S+@\S+\.\S+$/.test(field.value)) msg = "Enter a valid email address.";
    else if (field.type === "tel" && field.value.replace(/\D/g, "").length < 7) msg = "Enter a valid phone number.";
    else if (field.type === "number" && (field.value < 5 || field.value > 19)) msg = "Age must be between 5 and 19.";
    field.classList.toggle("bad", !!msg);
    var e = field.parentElement.querySelector(".err");
    if (e) e.textContent = msg;
    return !msg;
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (f) { if (!check(f)) ok = false; });
    if (!ok) { status.className = "fail"; status.textContent = "Please fix the highlighted fields."; return; }
    if (form.action.indexOf("YOUR_FORM_ID") > -1) {
      status.className = "fail";
      status.textContent = "The form is not connected yet. Add your Formspree ID in register.html.";
      return;
    }
    fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (r) {
        if (!r.ok) throw new Error();
        form.reset();
        status.className = "ok";
        status.textContent = "Thank you! We received your registration and will contact you soon.";
      })
      .catch(function () {
        status.className = "fail";
        status.textContent = "Something went wrong. Please try again or call us.";
      });
  });
});
