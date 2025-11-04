window.addEventListener("load", (event) => {
  emailjs.init({
    publicKey: '2O6OxPhF8Bn75ma96',
    // Do not allow headless browsers
    blockHeadless: true,    
    limitRate: {
      // limit rate
      id: 'app',
      // 1 request per 10s
      throttle: 10000,
    },
  });


});

const errorSpace = document.querySelector('.form_error');
errorSpace.style.display = 'none';

const successSpace = document.querySelector('.form_success');
successSpace.style.display = 'none';

let lastSubmissionTime = 0;
const MIN_TIME_BETWEEN_SUBMISSIONS = 10000; // 10s

function sendEmail(){
  const currentTime = Date.now();
  const timeSinceLastSubmission = currentTime - lastSubmissionTime;
  
  if (timeSinceLastSubmission < MIN_TIME_BETWEEN_SUBMISSIONS) {
    const timeLeft = Math.ceil((MIN_TIME_BETWEEN_SUBMISSIONS - timeSinceLastSubmission) / 1000);
    alert(`Molimo sačekajte ${timeLeft} sekundi prije slanja sljedeće poruke.`);
    return;
  }
  
  const rawName = document.getElementById('name').value;
  const rawEmail = document.getElementById('email').value;
  const rawMessage = document.getElementById('message').value;
  
  const name = sanitizeName(rawName);
  const email = sanitizeEmail(rawEmail);
  const message = sanitizeMessage(rawMessage);

  
  
  if (!name || !email || !message) {
    errorSpace.style.display = 'block';
    errorSpace.innerHTML ='<p>Molimo popunite sva polja.</p>';
    return;
  }
  
  if (!name || name.length < 2) {
    errorSpace.style.display = 'block';
    errorSpace.innerHTML ='<p>Ime mora sadržavati više od 2 karaktera.</p>';
    return;
  }
  
  if (!email || !isValidEmail(email)) {
    errorSpace.style.display = 'block';
    errorSpace.innerHTML ='<p>Molimo unesite ispravnu email adresu.</p>';
    return;
  }
  
  if (!message || message.length < 10) {
    errorSpace.style.display = 'block';
    errorSpace.innerHTML ='<p>Poruka mora sadržavati najmanje 10 karaktera.</p>';
    return;
  }
  
  // Update last submission time
  lastSubmissionTime = currentTime;
  
  // Disable submit button to prevent multiple clicks
  const submitBtn = document.getElementById('contact_form_send');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Šaljem...';
  
  const templateParams = {
    name: name,
    email: email,
    message: message
  };

  emailjs.send('service_yeiu65e', 'template_im2e1cw', templateParams)
    .then(() => {
      errorSpace.style.display = 'none';
      successSpace.style.display = 'block';
      successSpace.innerHTML ='<h4>Poruka poslana</h4> <p>Hvala Vam na poruci, odgovorit ćemo u najkraćem mogućem roku.</p>';      
      document.getElementById('contact-form').reset();      
      setTimeout(() => {
        successSpace.style.display = 'none';
      }, 6000);
    })
    .catch((error) => {
      errorSpace.style.display = 'block';
      errorSpace.innerHTML ='<p>Došlo je do greške pri slanju poruke. Molimo pokušajte ponovo.</p>';
    })
    .finally(() => {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}

// XSS Prevention
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    return input
        .trim()
        // Remove HTML tags
        .replace(/<[^>]*>/g, '')
        // Remove dangerous attributes
        .replace(/on\w+="[^"]*"/g, '')
        .replace(/on\w+='[^']*'/g, '')
        .replace(/on\w+=\w+/g, '')
        // Remove javascript: URLs
        .replace(/javascript:/gi, '')
        // Remove data: URLs
        .replace(/data:/gi, '')
        // Remove vbscript: URLs
        .replace(/vbscript:/gi, '')
        // Remove potentially dangerous protocols
        .replace(/(href|src)=("|')[^"']*script:/gi, '')
        // Limit length to prevent overflow
        .substring(0, 1000);
}

function sanitizeName(name) {
    return sanitizeInput(name)
        .replace(/[^a-zA-ZčćžšđČĆŽŠĐ\s\-']/g, '') 
        .substring(0, 100);
}

function sanitizeEmail(email) {
    return sanitizeInput(email)
        .toLowerCase()
        .substring(0, 254); 
}

function sanitizeMessage(message) {
    return sanitizeInput(message)
        .substring(0, 2000); 
}