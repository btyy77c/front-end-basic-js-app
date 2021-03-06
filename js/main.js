import DBHelper from './dbhelper.js'
import Map from './map.js'

let cuisines = []
let displayRestaurants = []
let restaurants = []
let neighborhoods = []

function createRestaurantHTML(restaurant) {
  const container = document.getElementById('restaurants-list')
  const div = document.createElement('div')
  div.className = 'responsive'

  const image = document.createElement('div')
  image.className = 'restaurant-img'
  image.style.backgroundImage = `url(${DBHelper.imageUrlForRestaurant(restaurant)})`
  image.setAttribute('aria-label', `Image for ${restaurant.name}`)
  image.setAttribute('role', `img`)
  image.setAttribute('alt', `Image for ${restaurant.name}`)
  div.append(image)

  const innerDiv = document.createElement('div')
  innerDiv.className = 'restaurant-text'
  div.append(innerDiv)

  const name = document.createElement('h3')
  name.innerHTML = restaurant.name
  innerDiv.append(name)

  const neighborhood = document.createElement('p')
  neighborhood.innerHTML = restaurant.neighborhood
  innerDiv.append(neighborhood)

  const address = document.createElement('p')
  address.innerHTML = restaurant.address
  innerDiv.append(address)

  const more = document.createElement('a')
  more.innerHTML = 'View Details'
  more.href = DBHelper.urlForRestaurant(restaurant)
  innerDiv.append(more)

  container.append(div)
  Map.addMarkerToMap(restaurant)
}

function fillCuisinesHTML() {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

function fillNeighborhoodsHTML() {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

function fillRestaurantsHTML() {
  resetRestaurants()
  displayRestaurants.forEach(restaurant => { createRestaurantHTML(restaurant) })
}

function fillVariables() {
  DBHelper.fetchRestaurants().then(response => {
    cuisines = response.cuisines
    neighborhoods = response.neighborhoods
    restaurants = response.restaurants
    displayRestaurants = response.restaurants
    fillNeighborhoodsHTML()
    fillCuisinesHTML()
    fillRestaurantsHTML()
  })
}

function resetRestaurants() {
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  Map.resetMarkers()
}

function updateRestaurants() {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cuisine = cSelect[cSelect.selectedIndex].value;
  const neighborhood = nSelect[nSelect.selectedIndex].value;

  displayRestaurants = DBHelper.
                       filterRestaurantsByCuisineAndNeighborhood(cuisine, neighborhood, restaurants)
  fillRestaurantsHTML()
}

document.addEventListener('DOMContentLoaded', () => {
  Map.initMap([40.722216, -73.987501], 12)
  fillVariables()
  document.getElementById('cuisines-select').addEventListener('change', updateRestaurants)
  document.getElementById('neighborhoods-select').addEventListener('change', updateRestaurants)
})

export default {}
