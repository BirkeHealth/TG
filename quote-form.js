/*
 * Built-in quote form. Sends the answers to the BHA-CRM server, which emails
 * the lead to the agency (nothing is stored).
 *
 * Markup: <form class="quote-form" data-site="birke|tuguardian" data-lang="en|es"
 *               data-endpoint="https://.../api/public/quote-request" novalidate> ... </form>
 * Fields by name: firstName, lastName, dob, phone, email, zip, people, income,
 * consent (checkbox), company (hidden honeypot).
 */
(function () {
  var TEXT = {
    en: {
      firstName: "Please enter your first name.",
      lastName: "Please enter your last name.",
      dob: "Please enter a valid date of birth.",
      phone: "Please enter a 10-digit phone number.",
      email: "Please enter a valid email (or leave it blank).",
      zip: "Please enter a 5-digit zip code.",
      people: "Please choose how many people.",
      income: "Please choose your household income.",
      consent: "Please check the consent box so we can contact you.",
      sending: "Sending…",
      network: "We couldn't send your request. Please check your connection or call us.",
    },
    es: {
      firstName: "Ingrese su nombre.",
      lastName: "Ingrese su apellido.",
      dob: "Ingrese una fecha de nacimiento válida.",
      phone: "Ingrese un teléfono de 10 dígitos.",
      email: "Ingrese un correo válido (o déjelo en blanco).",
      zip: "Ingrese un código postal de 5 dígitos.",
      people: "Elija cuántas personas.",
      income: "Elija sus ingresos.",
      consent: "Marque la casilla de consentimiento para poder contactarle.",
      sending: "Enviando…",
      network: "No pudimos enviar su solicitud. Revise su conexión o llámenos.",
    },
  };

  function digits(v) { return String(v || "").replace(/\D/g, ""); }

  function validate(data) {
    var errs = {};
    if (!data.firstName) errs.firstName = 1;
    if (!data.lastName) errs.lastName = 1;
    var d = /^\d{4}-\d{2}-\d{2}$/.test(data.dob) ? new Date(data.dob + "T00:00:00") : null;
    if (!d || isNaN(d) || d > new Date() || d.getFullYear() < 1900) errs.dob = 1;
    var p = digits(data.phone).replace(/^1(?=\d{10}$)/, "");
    if (p.length !== 10) errs.phone = 1;
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 1;
    if (!/^\d{5}$/.test(data.zip)) errs.zip = 1;
    if (!data.people) errs.people = 1;
    if (!data.income) errs.income = 1;
    if (!data.consent) errs.consent = 1;
    return errs;
  }

  function setup(form) {
    var t = TEXT[form.dataset.lang] || TEXT.en;
    var btn = form.querySelector("button[type=submit]");
    var btnLabel = btn ? btn.innerHTML : "";
    var status = form.querySelector(".quote-status");
    var success = form.parentNode.querySelector(".quote-success");

    function fieldError(name, msg) {
      var el = form.elements[name];
      if (!el) return;
      var group = el.closest(".form-group, .form-field, .quote-consent");
      if (!group) return;
      var box = group.querySelector(".field-error");
      if (msg) {
        if (!box) {
          box = document.createElement("span");
          box.className = "field-error";
          group.appendChild(box);
        }
        box.textContent = msg;
        group.classList.add("has-error");
        el.setAttribute("aria-invalid", "true");
      } else {
        if (box) box.remove();
        group.classList.remove("has-error");
        el.removeAttribute("aria-invalid");
      }
    }

    function read() {
      var f = form.elements;
      return {
        site: form.dataset.site,
        firstName: f.firstName.value.trim(),
        lastName: f.lastName.value.trim(),
        dob: f.dob.value,
        phone: f.phone.value.trim(),
        email: f.email.value.trim(),
        zip: f.zip.value.trim(),
        people: f.people.value,
        income: f.income.value,
        consent: f.consent.checked,
        company: f.company ? f.company.value : "",
        page: location.href.split("#")[0],
      };
    }

    form.addEventListener("input", function (e) {
      if (e.target.name) fieldError(e.target.name, null);
    });
    form.addEventListener("change", function (e) {
      if (e.target.name) fieldError(e.target.name, null);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (status) status.textContent = "";
      var data = read();
      var errs = validate(data);
      ["firstName", "lastName", "dob", "phone", "email", "zip", "people", "income", "consent"].forEach(function (k) {
        fieldError(k, errs[k] ? t[k] : null);
      });
      var first = Object.keys(errs)[0];
      if (first) {
        if (form.elements[first]) form.elements[first].focus();
        return;
      }

      if (btn) { btn.disabled = true; btn.textContent = t.sending; }
      fetch(form.dataset.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (body) {
            return { ok: res.ok && body.ok, error: body.error };
          });
        })
        .then(function (r) {
          if (!r.ok) throw new Error(r.error || t.network);
          form.hidden = true;
          if (success) { success.hidden = false; success.focus(); }
          if (window.gtag) window.gtag("event", "generate_lead", { form_site: data.site });
          if (window.fbq) window.fbq("track", "Lead");
        })
        .catch(function (err) {
          if (status) status.textContent = err && err.message && err.message !== "Failed to fetch" ? err.message : t.network;
          if (btn) { btn.disabled = false; btn.innerHTML = btnLabel; }
        });
    });
  }

  document.querySelectorAll("form.quote-form").forEach(setup);
})();
