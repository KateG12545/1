// DOM элементы
const getCardBtn = document.getElementById('getCardBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalContainer = document.getElementById('modalContainer');
const cardForm = document.getElementById('cardForm');
const modal = document.querySelector('.modal');

// Сохраняем элемент, который был в фокусе до открытия модалки
let previousActiveElement;

// Обработчики событий
getCardBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
cardForm.addEventListener('submit', handleFormSubmit);

// Закрытие модального окна при клике вне его
modalContainer.addEventListener('click', function(e) {
    if (e.target === modalContainer) {
        closeModal();
    }
});

// Закрытие по Esc
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalContainer.style.display === 'flex') {
        closeModal();
    }
});

// Функции
function openModal() {
    // Сохраняем текущий активный элемент
    previousActiveElement = document.activeElement;
    
    modalContainer.style.display = 'flex';
    // Переводим фокус на первый интерактивный элемент в модалке
    modal.querySelector('input, button').focus();
    
    // Ограничиваем фокус внутри модалки (для доступности)
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'modalTitle');
}

function closeModal() {
    modalContainer.style.display = 'none';
    // Возвращаем фокус на кнопку, которая открыла модалку
    if (previousActiveElement) {
        previousActiveElement.focus();
    }
    
    // Сбрасываем форму при закрытии
    cardForm.reset();
    // Удаляем сообщения об ошибках/успехе если есть
    const statusMessages = document.querySelectorAll('.form-status');
    statusMessages.forEach(msg => msg.remove());
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Удаляем предыдущие сообщения если есть
    const existingStatus = document.querySelector('.form-status');
    if (existingStatus) existingStatus.remove();
    
    // Базовая валидация
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const consent = document.getElementById('consent').checked;
    
    if (!name || !email || !message || !consent) {
        showStatus('Please fill all required fields', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showStatus('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        // Отправка на тестовый эндпоинт
        const response = await fetch('https://httpbin.org/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                message,
                consent
            })
        });
        
        const data = await response.json();
        console.log('Form submitted:', data);
        
        showStatus('Thank you! Your application has been submitted.', 'success');
        // Очищаем форму после успешной отправки
        cardForm.reset();
        
        // Закрываем модалку через 3 секунды
        setTimeout(closeModal, 3000);
        
    } catch (error) {
        console.error('Error:', error);
        showStatus('Something went wrong. Please try again.', 'error');
    }
}

function showStatus(message, type) {
    const statusDiv = document.createElement('div');
    statusDiv.className = `form-status form-status--${type}`;
    statusDiv.textContent = message;
    
    // Добавляем стили для статуса
    statusDiv.style.padding = '10px';
    statusDiv.style.margin = '15px 0';
    statusDiv.style.borderRadius = '4px';
    statusDiv.style.fontWeight = 'bold';
    
    if (type === 'success') {
        statusDiv.style.backgroundColor = '#d4edda';
        statusDiv.style.color = '#155724';
    } else {
        statusDiv.style.backgroundColor = '#f8d7da';
        statusDiv.style.color = '#721c24';
    }
    
    // Вставляем перед кнопкой Submit
    const submitBtn = cardForm.querySelector('button[type="submit"]');
    cardForm.insertBefore(statusDiv, submitBtn);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Управление фокусом внутри модалки (для доступности)
modal.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        const focusableElements = modal.querySelectorAll('input, button, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
});
