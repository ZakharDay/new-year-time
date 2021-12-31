import './index.scss'
import timezones from 'compact-timezone-list'

const now = new Date()

const today = new Date(
  now.getUTCFullYear(),
  now.getUTCMonth(),
  now.getUTCDate(),
  now.getUTCHours(),
  now.getUTCMinutes(),
  now.getUTCSeconds(),
  now.getUTCMilliseconds()
).getTime()

// const today = new Date().getTime()

console.log(today)

const zones = {}
const regexPattern = /\/[\s\S]*$/

timezones.forEach((timezone, i) => {
  const zoneName = timezone.offset
  const zone = zones[zoneName]

  const entity = timezone.tzCode
    .match(regexPattern)[0]
    .replace('/', '')
    .replace('_', ' ')

  if (zone) {
    zone.push(entity)
  } else {
    zones[zoneName] = [entity]
  }
})

const timezonesRow = document.getElementById('timezonesRow')
const zoneElements = []

Object.keys(zones).forEach((key) => {
  const container = document.createElement('div')
  const zoneNameElement = document.createElement('div')
  const citiesElement = document.createElement('div')

  const time = [
    key.charAt(0),
    parseInt(key.slice(1, 3)),
    parseInt(key.slice(4, 6))
  ]

  const diff = time[1] * 3600 * 1000 + time[2] * 60 * 1000
  const timestamp = time[0] === '-' ? today - diff : today + diff
  const currentTime = new Date(timestamp).toUTCString()

  const currentHours = new Date(timestamp).getHours()
  const currentMinutes = new Date(timestamp).getMinutes()

  let text = ''
  let current = false

  if (currentHours === 23 && currentMinutes >= 45) {
    text = 'Now happening in '
    current = true
  } else if (currentHours === 23 && currentMinutes >= 30) {
    text = 'Will be shortly in '
    current = true
  } else if (currentHours === 0 && currentMinutes <= 30) {
    text = 'Just happend in '
    current = true //TODO remove
  }

  zoneNameElement.innerText = key + ' ' + currentTime
  citiesElement.innerText = text + zones[key].join(', ')

  if (current) {
    container.classList = 'current'
  }

  container.appendChild(zoneNameElement)
  container.appendChild(citiesElement)
  timezonesRow.appendChild(container)

  console.log(key, currentHours, currentMinutes, timestamp)
})

const currentElementRect = document
  .getElementsByClassName('current')[0]
  .getBoundingClientRect()

let left =
  -currentElementRect.left + (window.innerWidth - currentElementRect.width) / 2

timezonesRow.style.transform = `translateX(${left}px)`
