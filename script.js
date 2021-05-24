const form = document.getElementById('form');

form.setAttribute('novalidate', true);

const hasError = (field) => {
  if (field.type === 'submit' || field.type === 'checkbox') return;

  const validity = field.validity;

  if (validity.valid) return;

  if (validity.valueMissing) return 'Required field';

  if (validity.typeMismatch) {
    if (field.type === 'email') return 'Enter a valid email address.';
  }

  return 'Entered value is invalid.';
};

const showError = (field, error) => {
  const validity = field.validity;

  field.classList.add('form__input_error');

  const id = field.id;
  if (!id) return;

  let message = field.form.querySelector('.form__input-error#error-for-' + id);
  if (!message) {
    message = document.createElement('div');
    message.className = 'form__input-error';
    message.id = 'error-for-' + id;

    field.parentNode.insertBefore(message, field.nextSibling);
  }

  field.setAttribute('aria-describedby', 'error-for-' + id);

  if (validity.typeMismatch) {
    field.setAttribute('aria-invalid', true);
  } else {
    field.removeAttribute('aria-invalid');
  }

  message.innerHTML = error;
  message.style.display = 'block';
  message.style.visibility = 'visible';
};

const removeError = (field) => {
  field.classList.remove('form__input_error');

  field.removeAttribute('aria-describedby');
  field.removeAttribute('aria-invalid');

  const id = field.id;
  if (!id) return;

  let message = field.form.querySelector(
    '.form__input-error#error-for-' + id + ''
  );
  if (!message) return;

  message.innerHTML = '';
  message.style.display = 'none';
  message.style.visibility = 'hidden';
};

document.addEventListener(
  'blur',
  (event) => {
    const error = hasError(event.target);

    if (error) {
      showError(event.target, error);
      return;
    }

    removeError(event.target);
  },
  true
);

document.addEventListener('submit', (event) => {
  const fields = event.target.elements;

  let error, hasErrors;
  for (let i = 0; i < fields.length; i++) {
    error = hasError(fields[i]);
    if (error) {
      showError(fields[i], error);
      if (!hasErrors) {
        hasErrors = fields[i];
      }
    }
  }

  if (hasErrors) {
    event.preventDefault();
    hasErrors.focus();
  }
});
