const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems(){
    const itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.forEach((item) => addItemToDOM(item));
    checkUI();
}

//Valid Input
function onAddItemSubmit(e){
    e.preventDefault();

    const newItem = itemInput.value;

    if(newItem === ''){
        alert('Please enter an item');
        return;
    }

    //check for edit mode
    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }else {
        if(checkIfItemExixt(newItem)){
            alert('Item already exists');
            return;
        }
    }

    // Create item DOM element
    addItemToDOM(newItem);

    // add item to local storage
    addItemToStorage(newItem);

    checkUI();
    console.log(li);
    itemInput = '';
    
}

function addItemToDOM(item){
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    
    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    itemList.appendChild(li);
}

function addItemToStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    // Add items to storage
    itemsFromStorage.push(item);

    // Convert to JSON and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage(){
    let itemsFromStorage;
    
    if(localStorage.getItem('items') == null){
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

function createButton(classes){
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}
function createIcon(classes){
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}


function checkIfItemExixt(item){
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"><i/> Update Item';
    formBtn.style.backgroundColor = '#228822';
    itemInput.value = item.textContent;
}

function removeItem(item){
    if(confirm('Are You Sure?')){
        // Remove Item from DOM
        item.remove();

        // remove item from Storage
        removeItemFromStorage(item.textContent);


        checkUI();
    }
}

function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    //Filter out items to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i != item);

    //re-set to localstorage
    localStorage.setItem('items',JSON.stringify(itemsFromStorage));
    
}

function clearItem(){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
    }
    //clear from local storage
    localStorage.removeItem('items');

    checkUI();
}

function filterItems(e){
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();
    console.log(text);

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLocaleLowerCase();

        if(itemName.indexOf(text) != -1){
            
            item.style.display = 'flex';
        }else{
            item.style.display = 'none';
        }
        console.log(itemName);
    })
}



function checkUI(){
    itemInput.value = '';

    const items = itemList.querySelectorAll('li');
    console.log(items);
    if(items.length === 0){
        clearButton.style.display = 'none';
        itemFilter.style.display = 'none';
    } else{
        clearButton.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"</i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
}

// Initialize app
function init(){
    itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearButton.addEventListener('click', clearItem);
itemFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems);

checkUI();
}

init();



