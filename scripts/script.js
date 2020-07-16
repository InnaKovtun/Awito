'use strict';

const  dataBase = JSON.parse(localStorage.getItem('awito')) || [ ];
let counter = dataBase.length;
//добавляем в переменную кнопку
const modalAdd = document.querySelector('.modal__add'),
    addAd = document.querySelector('.add__ad'),
    modalBtnSubmit = document.querySelector('.modal__btn-submit'),
    modalSubmit = document.querySelector('.modal__submit'),
    catalog = document.querySelector('.catalog'),
    modalItem = document.querySelector('.modal__item'),
    modalBtnWarning = document.querySelector('.modal__btn-warning'),
    modalFileInput = document.querySelector('.modal__file-input'),
    modalFileBtn = document.querySelector('.modal__file-btn'),
    modalImageAdd = document.querySelector('.modal__image-add');

const modalImageItem = document.querySelector('.modal__image-item'),
    modalHeaderItem = document.querySelector('.modal__header-item'),
    modalStatusItem = document.querySelector('.modal__status-item'),
    modalDescriptionItem = document.querySelector('.modal__description-item'),
    modalCostItem = document.querySelector('.modal__cost-item');

const searchInput = document.querySelector('.search__input'),
    menuContainer = document.querySelector('.menu__container');

const textFileBtn = modalFileBtn.textContent;

const srcModelImage = modalImageAdd.src;

const elementsModalSubmit = [...modalSubmit.elements]
    .filter(elem => elem.tagName !== 'BUTTON');

const infoPhoto = {};

const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase));

//проверка элементов в форме на заполненость, в итоге разблокируем кнопку и убираем фразу
const checkForm = () => {
    const validForm = elementsModalSubmit.every(elem => elem.value);
    modalBtnSubmit.disabled = !validForm;
    modalBtnWarning.style.display = validForm ? 'none' : ''; 
}

//функция для закрытия модальных окон
const closeModal = event => {
    const target = event.target;

    if(target.closest('.modal__close') 
    || target.classList.contains('modal')
    || event.code === 'Escape'){ 
        modalAdd.classList.add('hide');
        modalItem.classList.add('hide');
        document.removeEventListener('keydown', closeModal);
        modalSubmit.reset(); //очищение формы
        modalFileBtn.textContent = srcModelImage;
        modalImageAdd.src = textFileBtn;
        checkForm();
    } 
}
 
const renderCard = (DB = dataBase) => {
    catalog.textContent = '';

    DB.forEach(item =>{
        catalog.insertAdjacentHTML('beforeend', `
            <li class="card" data-id-item = "${item.id}">
                <img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test">
                <div class="card__description">
                    <h3 class="card__header">${item.nameItem}</h3>
                    <div class="card__price">${item.costItem} грн</div>
                </div>
            </li>
        `);
    });
};

searchInput.addEventListener('input', () => {
    // trim - обрезает пробелы спереди и сзади (   -    ) -> (-)
    const valueSearch = searchInput.value.trim().toLowerCase();

    if(valueSearch.length > 2){
        const result = dataBase.filter(item => item.nameItem.toLowerCase().includes(valueSearch) || 
                        item.descriptionItem.toLowerCase().includes(valueSearch));
        renderCard(result);
        
    }
});

modalFileInput.addEventListener('change', () => {
    const target = event.target;

    const reader = new FileReader();

    const file = target.files[0];

    infoPhoto.filename = file.name;
    infoPhoto.size = file.size;

    reader.readAsBinaryString(file);  
    console.log(target.files[0]);
    
    reader.addEventListener('load', event => {
        if(infoPhoto.size < 200000 ){
            modalFileBtn.textContent = infoPhoto.filename;
            infoPhoto.base64 = btoa(event.target.result); //конвертируем картинку в строку
            modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`;
         } else {
            modalFileBtn.textContent = 'Файл не должен превышать 200 кБ';
            modalFileInput.value = '';
            checkForm(); 
        }
        
    }); 
    
});

modalSubmit.addEventListener('input', checkForm);

modalSubmit.addEventListener('submit', event => {
    event.preventDefault(); //блокируем стандартную перезагрузку страницы
    const itemObj = {}; //создаем объект 
    for (const elem of elementsModalSubmit){
         itemObj[elem.name] = elem.value;
         itemObj.id = counter++; //уникальное число для каждого объявления
    } //заполняем его инфой о товаре
    itemObj.image = infoPhoto.base64;
    dataBase.push(itemObj); //добавляем в массив
    closeModal({target: modalAdd}); //закрываем окно при добавлении
    saveDB();
    renderCard();
});

addAd.addEventListener('click', ()=> {
    //при клике на кнопку появляется модальное окно 
    modalAdd.classList.remove('hide');
    //блокируется кнопка "Отправить" при выводе окна
    modalBtnSubmit.disabled = true;
    document.addEventListener('keydown', closeModal);
}); 

//открываем модальное окно при нажатии на карточку товара
catalog.addEventListener('click', event => {
    const target = event.target;
    const card = target.closest('.card');
    //если у таргет родительский класс кард, то открываем модальное окно
    if(card){
        const item = dataBase.find(obj => obj.id === parseInt(card.dataset.idItem)) ;

        //заполняем модальные окна объявлений с базы
        modalImageItem.src = `data:image/jpeg;base64,${item.image}`;
        modalHeaderItem.textContent = item.nameItem;
        modalStatusItem.textContent = item.status === 'new' ? 'Новый' : 'Б/У';
        modalDescriptionItem.textContent = item.descriptionItem;
        modalCostItem.textContent = item.costItem + ' грн';
        modalItem.classList.remove('hide');
        document.addEventListener('keydown', closeModal);
    };
});

//поиск по разделам меню
menuContainer.addEventListener('click', event => {
    const target = event.target;

    if(target.tagName === 'A'){
        const result = dataBase.filter(item => item.category === target.dataset.category);
        renderCard(result);
    }
});

//закрытие модальных окон
modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);

renderCard();
