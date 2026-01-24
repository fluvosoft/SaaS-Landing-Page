// Client-side script for handling contact form submission

import { submitContactForm, type ContactFormData } from '../../lib/firebase/firestore';

export function initContactForm(formId: string = 'contact-form') {
  const form = document.getElementById(formId) as HTMLFormElement;
  if (!form) {
    console.error('Contact form not found');
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
  const originalButtonText = submitButton?.textContent || 'Send Message';
  const successMessage = form.querySelector('.success-message') as HTMLElement;
  const errorMessage = form.querySelector('.error-message') as HTMLElement;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable submit button
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    // Hide previous messages
    if (successMessage) successMessage.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';

    try {
      // Get form data
      const formData = new FormData(form);
      const contactData: ContactFormData = {
        firstName: (formData.get('hs-firstname-contacts') as string) || '',
        lastName: (formData.get('hs-lastname-contacts') as string) || '',
        email: (formData.get('hs-email-contacts') as string) || '',
        phone: (formData.get('hs-phone-number') as string) || '',
        details: (formData.get('hs-about-contacts') as string) || '',
      };

      // Validate required fields
      if (!contactData.firstName || !contactData.lastName || !contactData.email || 
          !contactData.phone || !contactData.details) {
        throw new Error('Please fill in all fields');
      }

      // Submit to Firebase
      await submitContactForm(contactData);

      // Show success message
      if (successMessage) {
        successMessage.textContent = 'Thank you! Your message has been sent. We\'ll get back to you soon.';
        successMessage.style.display = 'block';
      }

      // Reset form
      form.reset();

    } catch (error: any) {
      // Show error message
      if (errorMessage) {
        errorMessage.textContent = error.message || 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
      }
      console.error('Form submission error:', error);
    } finally {
      // Re-enable submit button
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}
