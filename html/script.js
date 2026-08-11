import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// Scroll Animation Logic
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target); // Only animate once
    }
  });
}, observerOptions);

document.querySelectorAll('.card').forEach((card, index) => {
  card.classList.add('animate-on-scroll');
  // Stagger animation based on column index (5 columns)
  card.style.transitionDelay = `${(index % 5) * 0.1}s`;
  observer.observe(card);
});

// Firebase Logic
const firebaseConfig = {
  apiKey: "AIzaSyBoAb7b3DJDMRmNwOSAHTnscM_-JuVnILI",
  authDomain: "cookdcode-4ce23.firebaseapp.com",
  projectId: "cookdcode-4ce23",
  storageBucket: "cookdcode-4ce23.appspot.com",
  messagingSenderId: "419836764054",
  appId: "1:419836764054:web:63e6752e821a79a29f07b7"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const userId = localStorage.getItem("userId") || localStorage.getItem("uid");
const userEmail = localStorage.getItem("currentEmail");

// Profile Dropdown Logic
const avatarBtn = document.getElementById('avatarBtn');
const dropdownMenu = document.getElementById('dropdownMenu');
const userAvatar = document.getElementById('userAvatar');
const dropdownEmail = document.getElementById('dropdownEmail');

if (avatarBtn && dropdownEmail && userAvatar && dropdownMenu) {
  if (userEmail) {
    dropdownEmail.textContent = userEmail;
    // Generate avatar based on email (first letter)
    const initial = userEmail.charAt(0).toUpperCase();
    // userAvatar.src logic removed to keep profile picture
  } else {
    dropdownEmail.textContent = "Guest User";
  }

  avatarBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('active');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdownMenu.contains(e.target) && !avatarBtn.contains(e.target)) {
      dropdownMenu.classList.remove('active');
    }
  });
}

// SVG Circle Math
const radius = 40;
const circumference = 2 * Math.PI * radius; // 251.2

function animateProgress(card, targetProgress) {
  const progressContainer = card.querySelector('.progress-container');
  const progressBar = card.querySelector('.progress-bar');
  const valueSpan = card.querySelector('.value');
  const percentSpan = card.querySelector('.percent');
  const btn = card.querySelector('.btn');
  
  // Remove loading state
  progressContainer.classList.remove('loading');

  // Calculate stroke offset
  const offset = circumference - (targetProgress / 100) * circumference;
  
  // Trigger CSS transition for the ring
  setTimeout(() => {
    progressBar.style.strokeDashoffset = offset;
  }, 50);

  // Animate the number counting up
  let current = 0;
  const duration = 1000; // 1 second
  const stepTime = Math.max(Math.floor(duration / (targetProgress || 1)), 10);

  if (targetProgress > 0) {
    const timer = setInterval(() => {
      current += 1;
      valueSpan.textContent = current;
      
      if (current >= targetProgress) {
        clearInterval(timer);
        valueSpan.textContent = targetProgress;
        
        // Handle 100% completion state
        if (targetProgress === 100) {
          card.classList.add('completed');
          valueSpan.innerHTML = '<i class="fas fa-check"></i>';
          percentSpan.style.display = 'none';
          btn.textContent = 'Review Challenge';
        }
      }
    }, stepTime);
  } else {
    valueSpan.textContent = 0;
  }
}

if (userId) {
  // Force progress indicators to show 0% and visually display an empty ring
  document.querySelectorAll('.card').forEach(card => {
    const progressContainer = card.querySelector('.progress-container');
    const progressBar = card.querySelector('.progress-bar');
    const valueSpan = card.querySelector('.value');
    const percentSpan = card.querySelector('.percent');
    if (progressContainer) progressContainer.classList.remove('loading');
    if (progressBar) progressBar.style.strokeDashoffset = circumference;
    if (valueSpan) valueSpan.textContent = 0;
    if (percentSpan) percentSpan.style.display = '';
  });

  document.querySelectorAll('.card').forEach(card => {
    const topic = card.getAttribute('data-topic');
    // Map data-topic to the correct firebase ID if necessary
    // Here we assume it maps to 'fundamentals' category as newuser.html shows fondamentals
    get(ref(db, `userProgress/${userId}/programs/fundamentals/${topic}`)).then(snapshot => {
      let progress = 0;
      if (snapshot.exists()) {
        progress = snapshot.val().progress || 0;
      }
      animateProgress(card, progress);
    }).catch(err => {
      console.error("Firebase error:", err);
      animateProgress(card, 0); // Fallback to 0 on error
    });
  });
} else {
  console.log("No user session found. Progress will remain at 0%.");
  document.querySelectorAll('.card').forEach(card => {
    animateProgress(card, 0);
  });
}



