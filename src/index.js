import './index.scss'
import timezones from 'compact-timezone-list'

const zones = {}
const regexPattern = /\/[\s\S]*$/
const timezonesRow = document.getElementById('timezonesRow')
let left = 0

function init() {
  getZones()
  createElements().then(setContent).then(moveCurrentElement)
}

function getZones() {
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
}

function nowUTCTime() {
  const now = new Date()

  const utcTime = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
    now.getUTCMilliseconds()
  ).getTime()

  return utcTime
}

function createElements() {
  return new Promise(function (resolve, reject) {
    const zoneElements = []

    Object.keys(zones).forEach((key) => {
      const container = document.createElement('div')
      const zoneNameElement = document.createElement('div')
      const citiesElement = document.createElement('div')

      container.appendChild(zoneNameElement)
      container.appendChild(citiesElement)
      timezonesRow.appendChild(container)
    })

    resolve()
  })
}

function setContent() {
  return new Promise(function (resolve, reject) {
    const today = nowUTCTime()
    const elements = timezonesRow.children

    Object.keys(zones).forEach((key, i) => {
      const container = elements[i]
      const zoneNameElement = container.children[0]
      const citiesElement = container.children[1]

      const time = [
        key.charAt(0),
        parseInt(key.slice(1, 3)),
        parseInt(key.slice(4, 6))
      ]

      const diff = time[1] * 3600 * 1000 + time[2] * 60 * 1000
      const timestamp = time[0] === '-' ? today - diff : today + diff
      const currentTime = new Date(timestamp).toString()

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
      } else if (currentHours === 0 && currentMinutes <= 29) {
        text = 'Just happend in '
        current = true
      }

      zoneNameElement.innerText = key + ' ' + currentTime
      citiesElement.innerText = text + zones[key].join(', ')

      if (current && !container.classList.contains('current')) {
        container.classList.add('current')
        resolve()
      } else if (current && container.classList.contains('current')) {
        container.classList.add('current')
      } else {
        container.classList.remove('current')
      }
    })
  })
}

function moveCurrentElement() {
  const currentElementRect = document
    .getElementsByClassName('current')[0]
    .getBoundingClientRect()

  if (left === 0) {
    left =
      -currentElementRect.left +
      (window.innerWidth - currentElementRect.width) / 2
  } else {
    left =
      left -
      currentElementRect.left +
      (window.innerWidth - currentElementRect.width) / 2
  }

  timezonesRow.style.transform = `translateX(${left}px)`
}

init()

setInterval(() => {
  setContent().then(moveCurrentElement)
}, 60000)
