import hoods from '../data/hoods-201804.json'
import hoodsTainan from '../data/hoods-tainan-201804.json'
import newHoods from '../data/hoods-202205.json'

export function cities() {
  return hoods.cities
}

export function districts() {
  return hoods.districts
}

export function neighborhoods() {
  return hoods.neighborhoods.map(neighborhood => {
    return neighborhood.city_name === hoodsTainan.city_name
      ? hoodsTainan
      : neighborhood
  })
}

export function cityObject() {
  return newHoods
}
