// State
let currentFeedbackText = "";
let feedbackTimer = null;

// UI Helpers
window.toggleSection = (section) => {
    const content = document.getElementById(`content-${section}`);
    const btn = document.getElementById(`btn-${section}`);
    const sectionEl = document.getElementById(`section-${section}`);
    const isOpen = content.classList.contains('open');

    // Close feedback card when interacting with sections
    if (!isOpen) {
        clearFeedback(true); // true means skip the long timeout for immediate hiding if needed
        
        content.classList.add('open');
        sectionEl.classList.add('is-open');
        btn.innerHTML = '<i class="fas fa-times text-[10px]"></i> Close';
        btn.classList.replace('bg-[#1a202c]', 'bg-gray-200');
        btn.classList.replace('text-white', 'text-gray-700');
        sectionEl.classList.add('ring-2', 'ring-[#3a86cc]', 'ring-opacity-50');
        
        // Smooth scroll to the opened section
        setTimeout(() => {
            sectionEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    } else {
        content.classList.remove('open');
        sectionEl.classList.remove('is-open');
        btn.innerHTML = '<i class="fas fa-pen text-[10px]"></i> Write';
        btn.classList.replace('bg-gray-200', 'bg-[#1a202c]');
        btn.classList.replace('text-gray-700', 'text-white');
        sectionEl.classList.remove('ring-2', 'ring-[#3a86cc]', 'ring-opacity-50');
    }
};

const showToast = (message, type = 'success') => {
    const toast = document.getElementById('toast');
    if (!toast) return;

    let icon = '<i class="fas fa-info-circle text-blue-500"></i>';
    if (type === 'success') icon = '<i class="fas fa-check-circle text-emerald-500"></i>';
    if (type === 'warning') icon = '<i class="fas fa-exclamation-triangle text-amber-500"></i>';
    if (type === 'error') icon = '<i class="fas fa-times-circle text-rose-500"></i>';

    toast.className = `toast ${type} show`;
    toast.innerHTML = `${icon} <span>${message}</span>`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
};

window.showToast = showToast;

// Manual Help Integration (API Key not required)

window.checkInput = async (section) => {
    const inputId = section === 'samplecode' ? 'sampleInput' : `${section}Input`;
    const input = document.getElementById(inputId).value.trim();
    
    if (!input) {
        showToast("Please write something first!", "error");
        return;
    }

    const feedbackCard = document.getElementById('aiFeedbackCard');
    const resizer = document.getElementById('resizer');
    const feedbackContent = document.getElementById('aiFeedbackContent');
    const loadingIndicator = document.getElementById('aiFeedbackLoading');
    
    // Show feedback card if hidden
    if (feedbackCard.classList.contains('hidden')) {
        feedbackCard.classList.remove('hidden');
        resizer.classList.remove('hidden');
        void feedbackCard.offsetWidth;
        feedbackCard.style.height = '350px';
        feedbackCard.classList.replace('feedback-closed', 'feedback-open');
    }

    // Clear any existing timer
    if (feedbackTimer) clearTimeout(feedbackTimer);

    // Show loading briefly
    loadingIndicator.classList.remove('hidden');
    feedbackContent.classList.add('hidden');

    setTimeout(() => {
        feedbackContent.innerHTML = "<strong>Manual Mode:</strong> AI analysis is disabled. Please <strong>review your work manually</strong> against the problem description. Great effort on completing this section!";
        loadingIndicator.classList.add('hidden');
        feedbackContent.classList.remove('hidden');
        showToast("Section marked for review!");

        // Set auto-close timer (15 seconds)
        feedbackTimer = setTimeout(() => {
            clearFeedback();
        }, 15000);
    }, 800);
};

window.playCurrentFeedback = () => {
    const text = document.getElementById('aiFeedbackContent').textContent;
    if (!text || text.includes("Select a section")) return;
    
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
};

window.clearFeedback = (immediate = false) => {
    const feedbackCard = document.getElementById('aiFeedbackCard');
    const resizer = document.getElementById('resizer');
    
    if (feedbackTimer) {
        clearTimeout(feedbackTimer);
        feedbackTimer = null;
    }

    feedbackCard.style.height = '0px';
    feedbackCard.classList.replace('feedback-open', 'feedback-closed');
    
    const delay = immediate ? 0 : 600;
    
    setTimeout(() => {
        feedbackCard.classList.add('hidden');
        resizer.classList.add('hidden');
        document.getElementById('aiFeedbackContent').textContent = "Select a section and click 'Help' to get AI guidance, or click 'Check' after writing your solution to get feedback.";
    }, delay);
    
    window.speechSynthesis.cancel();
};

// Resizer Logic
const initResizer = () => {
    const resizer = document.getElementById('resizer');
    const topCard = document.getElementById('challengeCard');
    const bottomCard = document.getElementById('aiFeedbackCard');
    const container = topCard.parentElement;

    let isResizing = false;

    const startResizing = (e) => {
        isResizing = true;
        resizer.classList.add('is-resizing');
        document.body.style.cursor = 'row-resize';
        bottomCard.style.transition = 'none';
    };

    const stopResizing = () => {
        if (isResizing) {
            isResizing = false;
            resizer.classList.remove('is-resizing');
            document.body.style.cursor = 'default';
            bottomCard.style.transition = 'all 0.5s ease-in-out';
        }
    };

    const handleResize = (clientY) => {
        if (!isResizing) return;

        const containerRect = container.getBoundingClientRect();
        const relativeY = clientY - containerRect.top;
        
        const minTopHeight = 150;
        const minBottomHeight = 100;
        const maxBottomHeight = containerRect.height - minTopHeight;

        let newBottomHeight = containerRect.height - relativeY;
        
        if (newBottomHeight < minBottomHeight) newBottomHeight = minBottomHeight;
        if (newBottomHeight > maxBottomHeight) newBottomHeight = maxBottomHeight;

        bottomCard.style.height = `${newBottomHeight}px`;
    };

    resizer.addEventListener('mousedown', startResizing);
    resizer.addEventListener('touchstart', (e) => {
        startResizing();
        // Prevent scrolling while resizing
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('mousemove', (e) => handleResize(e.clientY));
    document.addEventListener('touchmove', (e) => {
        if (isResizing) {
            handleResize(e.touches[0].clientY);
            e.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('mouseup', stopResizing);
    document.addEventListener('touchend', stopResizing);
    document.addEventListener('touchcancel', stopResizing);
};

// Mock Save Function
window.saveProgramData = () => {
    const saveBtn = document.getElementById('saveBtn');
    const originalContent = saveBtn.innerHTML;
    
    const data = {
        logic: document.getElementById('logicInput').value,
        recipe: document.getElementById('recipeInput').value,
        ingredients: document.getElementById('ingredientsInput').value,
        sample: document.getElementById('sampleInput').value,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('cookdcode_progress', JSON.stringify(data));
    
    // Visual Confirmation
    saveBtn.innerHTML = '<i class="fas fa-check"></i> <span class="hidden xs:inline">Saved!</span>';
    saveBtn.classList.replace('bg-[#3a86cc]', 'bg-emerald-500');
    saveBtn.classList.replace('shadow-blue-200', 'shadow-emerald-200');
    saveBtn.classList.add('save-pop');
    
    showToast("Progress saved successfully!", "success");
    
    setTimeout(() => {
        saveBtn.innerHTML = originalContent;
        saveBtn.classList.replace('bg-emerald-500', 'bg-[#3a86cc]');
        saveBtn.classList.replace('shadow-emerald-200', 'shadow-blue-200');
        saveBtn.classList.remove('save-pop');
    }, 2000);
};

// Initial Load
window.addEventListener('DOMContentLoaded', () => {
    // Profile Dropdown Logic
    const avatarBtn = document.getElementById('avatarBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const userAvatar = document.getElementById('userAvatar');
    const dropdownEmail = document.getElementById('dropdownEmail');
    const userEmail = localStorage.getItem("currentEmail");

    if (avatarBtn && dropdownMenu) {
        if (userEmail) {
            dropdownEmail.textContent = userEmail;
            const initial = userEmail.charAt(0).toUpperCase();
            // userAvatar.src logic removed to keep profile picture
        } else {
            dropdownEmail.textContent = "Guest User";
        }

        avatarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!dropdownMenu.contains(e.target) && !avatarBtn.contains(e.target)) {
                dropdownMenu.classList.remove('active');
            }
        });
    }

    initResizer();
    const saved = localStorage.getItem('cookdcode_progress');
    if (saved) {
        const data = JSON.parse(saved);
        if (document.getElementById('logicInput')) document.getElementById('logicInput').value = data.logic || "";
        if (document.getElementById('recipeInput')) document.getElementById('recipeInput').value = data.recipe || "";
        if (document.getElementById('ingredientsInput')) document.getElementById('ingredientsInput').value = data.ingredients || "";
        if (document.getElementById('sampleInput')) document.getElementById('sampleInput').value = data.sample || "";
    }
});

