 // Создаем переменные
const getCardBtn = document.getElementById('getCardBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalContainer = document.getElementById('modalContainer');

// Обработчики событий
getCardBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);

// Функции
function openModal() {
    modalContainer.style.display = 'flex';
}

function closeModal() {
    modalContainer.style.display = 'none';
}

// Закрытие модального окна при клике вне его
modalContainer.addEventListener('click', function(e) {
    if (e.target === modalContainer) {
        closeModal();
    }
});