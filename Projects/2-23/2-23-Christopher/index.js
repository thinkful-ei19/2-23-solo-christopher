'use strict';
$(function(){
// `STORE` is responsible for storing the underlying data
// that our app needs to keep track of in order to work.
//
// for a shopping list, our data model is pretty simple.
// we just have an array of shopping list items. each one
// is an object with a `name` and a `checked` property that
// indicates if it's checked off or not.
// we're pre-adding items to the shopping list so there's
// something to see when the page first loads.
const STORE = [
  {name: "apples", checked: false},
  {name: "oranges", checked: false},
  {name: "milk", checked: true},
  {name: "bread", checked: false}
];
//Allow for toggling out/in checked items
let toggleView = false;
let searching = false;
let searchResults = [];
let searchTerm = '';

function generateItemElement (item, itemIndex, template) {
    //Creates a single li tag for each item.
    //Standard if not toggled for check and search
    if (toggleView === false && searching === false) {
      return `
      <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
      </li>`;    
    }
  //If toggled for check and not search
  //Hide the checked boxes
    else if (toggleView === true && searching !== true){
      if (item.checked === true) {
        return `
        <li class="hidden js-item-index-element" data-item-index="${itemIndex}">
        <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
        <div class="shopping-item-controls">
          <button class="shopping-item-toggle js-item-toggle">
              <span class="button-label">check</span>
          </button>
          <button class="shopping-item-delete js-item-delete">
              <span class="button-label">delete</span>
          </button>
        </div>
        </li>`;  
      }
      else { //Show the nonchecked boxes
        return `
        <li class="js-item-index-element" data-item-index="${itemIndex}">
        <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
        <div class="shopping-item-controls">
          <button class="shopping-item-toggle js-item-toggle">
              <span class="button-label">check</span>
          </button>
          <button class="shopping-item-delete js-item-delete">
              <span class="button-label">delete</span>
          </button>
        </div>
        </li>`;   
      }
    }
  //If search is true and toggle check is false
  else if (searching === true && toggleView === false){
    //return with all unmatching values as hidden, matching as not hidden.
    //If it matches. show it.
      if (item.name.indexOf(searchTerm) !== -1) {
        return `
        <li class="js-item-index-element" data-item-index="${itemIndex}">
        <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
        <div class="shopping-item-controls">
          <button class="shopping-item-toggle js-item-toggle">
              <span class="button-label">check</span>
          </button>
          <button class="shopping-item-delete js-item-delete">
              <span class="button-label">delete</span>
          </button>
        </div>
        </li>`;   
      } else { //If it doesn't match, hide it.
        return `
        <li class="hidden js-item-index-element" data-item-index="${itemIndex}">
        <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
        <div class="shopping-item-controls">
          <button class="shopping-item-toggle js-item-toggle">
              <span class="button-label">check</span>
          </button>
          <button class="shopping-item-delete js-item-delete">
              <span class="button-label">delete</span>
          </button>
        </div>
        </li>`;   
      }
    }
}
function generateShoppingItemsString(shoppingList) {
    //This will create the entire HTML string to write onto the DOM.
    console.log("Generating shopping list element");
    const items = shoppingList.map((item, index) => generateItemElement(item, index));
    return items.join("");
}

function renderShoppingList() {
  // this function will be repsonsible for rendering the shopping list in
  // the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE);
    $('.js-shopping-list').html(shoppingListItemsString);
}

function addItemToShoppingList(itemName) {
    console.log(`Adding "${itemName}" to shopping list`);
    STORE.push({name: itemName, checked: false});
}


function handleNewItemSubmit() {
  // this function will be responsible for when users add a new shopping list item
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    console.log(newItemName);
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
    console.log("Toggling checked property for item and index " + itemIndex);
    STORE[itemIndex].checked = !STORE[itemIndex].checked;
}

function getItemIndexFromElement(item) {
    const itemIndexString = $(item).closest('.js-item-index-element').attr('data-item-index');
    return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  // this function will be reponsible for when users click the "check" button on
  // a shopping list item.
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    console.log(itemIndex);
    //Gets index of current array, this may be the checked array.
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list
  // item
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    console.log(itemIndex);
    console.log('`handleDeleteItemClicked` ran');
    STORE.splice(itemIndex, 1);
    renderShoppingList();
  })
}
  //User can press a switch to toggle between displaying all items or just unchecked items

function showUnchecked() {
  $('.js-shopping-list-toggle-view').on('click', function() {
    //Mark non-checked as hidden HTML elements
      toggleView = true;
      searching = false;
      renderShoppingList();
  })
}
  //User can type in a search term and the displayed list will be filtered by item names only containing that search term
function searchItem() {
  $('#js-shopping-list-search-form').submit(function(event) {
    searching = true;
    toggleView = false;
    event.preventDefault();
    searchTerm = '';
    searchTerm = $('.js-shopping-list-search').val();
    searchResults = [];
    for (let i=0; i<STORE.length; i++) {
      if (STORE[i].name.indexOf(searchTerm) !== -1) {
        searchResults.push(STORE[i]);
      }
    }
    renderShoppingList();
    return searchResults;
  })
}

function showAll() {
  $('.js-shopping-list-show').click(function() {
    toggleView = false;
    searching = false;
    event.preventDefault();
    renderShoppingList();
  })
}
  //User can edit the title of an item

function rename() {

}  
// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  showUnchecked();
  searchItem();
  showAll();
  editItem();
  rename();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);
})