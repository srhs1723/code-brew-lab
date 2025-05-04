
interface Template {
  name: string;
  description: string;
  html: string;
  css: string;
  javascript: string;
}

export const templates: Template[] = [
  {
    name: "Basic",
    description: "A simple HTML5 template",
    html: `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello World</h1>
  <p>This is a basic HTML template.</p>
</body>
</html>`,
    css: `body {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #C05746;
}`,
    javascript: `// Your JavaScript code here
console.log("Hello from HTMLReader!");`
  },
  {
    name: "Navbar",
    description: "Responsive navigation bar",
    html: `<!DOCTYPE html>
<html>
<head>
  <title>Navbar Example</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <header>
    <nav class="navbar">
      <div class="logo">Brand</div>
      <button class="menu-toggle" aria-label="Toggle Menu">☰</button>
      <ul class="nav-links">
        <li><a href="#" class="active">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <h1>Responsive Navigation Bar</h1>
    <p>Resize the window to see how the navbar responds.</p>
  </main>
</body>
</html>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #3A2618;
  color: white;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  list-style: none;
}

.nav-links li {
  margin-left: 1.5rem;
}

.nav-links a {
  text-decoration: none;
  color: #f5f1ed;
  transition: color 0.3s;
}

.nav-links a:hover, .nav-links a.active {
  color: #C05746;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

main {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 1rem;
  color: #3A2618;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }
  
  .nav-links {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: #3A2618;
    padding: 1rem;
    display: none;
  }
  
  .nav-links.show {
    display: flex;
  }
  
  .nav-links li {
    margin: 0.5rem 0;
  }
}`,
    javascript: `// Toggle mobile menu
document.querySelector('.menu-toggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('show');
});`
  },
  {
    name: "Contact Form",
    description: "Styled contact form with validation",
    html: `<!DOCTYPE html>
<html>
<head>
  <title>Contact Form</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <div class="container">
    <h1>Contact Us</h1>
    <form id="contact-form">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" required>
        <span class="error-message"></span>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" required>
        <span class="error-message"></span>
      </div>
      <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" rows="5" required></textarea>
        <span class="error-message"></span>
      </div>
      <button type="submit">Send Message</button>
    </form>
    <div id="success-message" class="hidden">
      Thank you! Your message has been sent.
    </div>
  </div>
</body>
</html>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  background-color: #f5f1ed;
  color: #3A2618;
}

.container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 1.5rem;
  color: #3A2618;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #C05746;
  box-shadow: 0 0 0 2px rgba(192, 87, 70, 0.2);
}

button {
  display: block;
  width: 100%;
  padding: 0.75rem;
  background-color: #C05746;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #943126;
}

.error-message {
  display: block;
  color: #C05746;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  min-height: 1.25rem;
}

.hidden {
  display: none;
}

#success-message {
  text-align: center;
  padding: 1rem;
  background-color: #e8f5e9;
  color: #2e7d32;
  border-radius: 4px;
  margin-top: 1rem;
}

@media (max-width: 640px) {
  .container {
    margin: 1rem;
    padding: 1.5rem;
  }
}`,
    javascript: `document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const successMessage = document.getElementById('success-message');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    
    // Simple validation
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    // Clear previous error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.textContent = '');
    
    // Validate name
    if (nameInput.value.trim() === '') {
      nameInput.nextElementSibling.textContent = 'Name is required';
      isValid = false;
    }
    
    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value)) {
      emailInput.nextElementSibling.textContent = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Validate message
    if (messageInput.value.trim().length < 10) {
      messageInput.nextElementSibling.textContent = 'Message must be at least 10 characters';
      isValid = false;
    }
    
    if (isValid) {
      // Simulate form submission
      form.style.display = 'none';
      successMessage.classList.remove('hidden');
      
      // In real app, you would send the data to a server here
      console.log({
        name: nameInput.value,
        email: emailInput.value,
        message: messageInput.value
      });
    }
  });
});`
  },
  {
    name: "Card Grid",
    description: "Responsive card layout with flexbox",
    html: `<!DOCTYPE html>
<html>
<head>
  <title>Card Grid</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <div class="container">
    <header>
      <h1>Card Grid Layout</h1>
      <p>A responsive grid of cards using flexbox.</p>
    </header>
    
    <div class="card-grid">
      <div class="card">
        <div class="card-image" style="background-color: #C89F65;"></div>
        <div class="card-content">
          <h2>Card Title 1</h2>
          <p>This is some sample content for the first card in our grid layout.</p>
          <button>Read More</button>
        </div>
      </div>
      
      <div class="card">
        <div class="card-image" style="background-color: #7D5A50;"></div>
        <div class="card-content">
          <h2>Card Title 2</h2>
          <p>Cards are great for organizing content into digestible sections.</p>
          <button>Read More</button>
        </div>
      </div>
      
      <div class="card">
        <div class="card-image" style="background-color: #C05746;"></div>
        <div class="card-content">
          <h2>Card Title 3</h2>
          <p>This grid automatically adjusts based on the viewport width.</p>
          <button>Read More</button>
        </div>
      </div>
      
      <div class="card">
        <div class="card-image" style="background-color: #3A2618;"></div>
        <div class="card-content">
          <h2>Card Title 4</h2>
          <p>Try resizing your browser window to see the responsive behavior.</p>
          <button>Read More</button>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  background-color: #f5f1ed;
  color: #3A2618;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  margin-bottom: 0.5rem;
  color: #3A2618;
}

.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.card {
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.card-image {
  height: 160px;
  background-size: cover;
  background-position: center;
}

.card-content {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card h2 {
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

.card p {
  margin-bottom: 1.5rem;
  color: #666;
  flex-grow: 1;
}

.card button {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  background-color: #C05746;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.card button:hover {
  background-color: #943126;
}

@media (max-width: 640px) {
  .container {
    padding: 1rem;
  }
  
  .card-grid {
    gap: 1rem;
  }
}`,
    javascript: `// Add hover effect and click action to cards
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach((card, index) => {
    const button = card.querySelector('button');
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      alert(\`You clicked on Card \${index + 1}\`);
    });
  });
});`
  }
];
