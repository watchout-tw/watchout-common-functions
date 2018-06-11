import hoods from '../data/hoods-201804.json'
import hoodsTainan from '../data/hoods-tainan-201804.json'

export function cities () {
  return hoods.cities
}

export function districts () {
  return hoods.districts
}

export function neighborhoods () {
  return hoods.neighborhoods.map(neighborhood => {
    return neighborhood.city_name === hoodsTainan.city_name ? hoodsTainan : neighborhood
  })
}
