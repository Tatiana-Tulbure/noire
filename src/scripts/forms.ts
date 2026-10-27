// Client-side validation for the demo forms — nothing is sent anywhere.
// Usage: <form data-demo-form data-next="/account/">

document.querySelectorAll<HTMLButtonElement>("[data-reveal]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.reveal!) as HTMLInputElement | null;
    if (!input) return;
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    btn.setAttribute("aria-pressed", String(show));
    btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
  });
});

function setError(el: HTMLInputElement | HTMLSelectElement, on: boolean) {
  el.classList.toggle("is-invalid", on);
  el.setAttribute("aria-invalid", String(on));
  const msg = el.closest(".field")?.querySelector<HTMLElement>(".field__error");
  if (msg) msg.hidden = !on;
}

export function validate(form: HTMLFormElement): boolean {
  let firstBad: HTMLElement | null = null;
  form.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select").forEach((el) => {
    if (el.type === "checkbox" || el.type === "radio" || el.disabled || el.closest("[hidden]")) return;
    const bad = !el.checkValidity();
    setError(el, bad);
    if (bad && !firstBad) firstBad = el;
  });
  form.querySelectorAll<HTMLInputElement>('input[type="checkbox"][required]').forEach((el) => {
    const bad = !el.checked;
    el.closest(".check")?.classList.toggle("is-invalid", bad);
    if (bad && !firstBad) firstBad = el;
  });
  (firstBad as HTMLElement | null)?.focus();
  return !firstBad;
}

document.querySelectorAll<HTMLFormElement>("[data-demo-form]").forEach((form) => {
  form.noValidate = true;
  form.addEventListener("input", (e) => {
    const el = e.target as HTMLInputElement;
    if (el.classList.contains("is-invalid") && el.checkValidity()) setError(el, false);
    if (el.type === "checkbox") el.closest(".check")?.classList.remove("is-invalid");
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate(form)) return;
    form.dispatchEvent(new CustomEvent("demo:valid"));
    // Concept project: say clearly that nothing was sent, then continue the demo flow
    const note = form.querySelector<HTMLElement>("[data-demo-confirm]");
    if (note) note.hidden = false;
    const next = form.dataset.next;
    if (next) setTimeout(() => (location.href = next), note ? 1800 : 0);
  });
});
