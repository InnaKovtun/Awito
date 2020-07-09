'use strict';

//добавляем в переменную кнопку
const modalAdd = document.querySelector('.modal__add'),
    addAd = document.querySelector('.add__ad'),
    modalBtnSubmit = document.querySelector('.modal__btn-submit'),
    modalSubmit = document.querySelector('.modal__submit'); 

addAd.addEventListener('click', ()=> {
    //при клике на кнопку появляется модальное окно 
    modalAdd.classList.remove('hide');
    //блокируется кнопка "Отправить" при выводе окна
    modalBtnSubmit.disabled = true;
}); 

modalAdd.addEventListener('click', (event) => {
    const target = event.target;
    //закрытие окна
    if(target.classList.contains('modal__close') || target === modalAdd){ 
        modalAdd.classList.add('hide');
        modalSubmit.reset(); //очищение формы
    }
});




