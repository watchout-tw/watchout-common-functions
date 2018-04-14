import * as util from './util'

const TOKEN = 'watchout-token'
const CITIZEN_ID = 'watchout-citizen-id'
const HANDLE = 'watchout-handle'
const ALBUM_ID = 'watchout-album-id'
const PERSONA_ID = 'watchout-persona-id'
const ROLES = 'watchout-roles'
const PERSONAS = 'watchout-personas'

export function cleanSlate() {
  localStorage.removeItem(TOKEN)
  localStorage.removeItem(CITIZEN_ID)
  localStorage.removeItem(HANDLE)
  localStorage.removeItem(ALBUM_ID)
  localStorage.removeItem(PERSONA_ID)
  localStorage.removeItem(ROLES)
  localStorage.removeItem(PERSONAS)
}

export const token = {
  set: (val) => {
    localStorage.setItem(TOKEN, val)
  },
  get: () => {
    return localStorage.getItem(TOKEN)
  },
  exist: () => {
    return !!localStorage.getItem(TOKEN)
  }
}

export const citizenID = {
  set: (val) => {
    localStorage.setItem(CITIZEN_ID, val)
  },
  get: () => {
    return localStorage.getItem(CITIZEN_ID)
  }
}

export const handle = {
  set: (val) => {
    localStorage.setItem(HANDLE, val)
  },
  get: () => {
    return localStorage.getItem(HANDLE)
  }
}

export const albumID = {
  set: (val) => {
    localStorage.setItem(ALBUM_ID, val)
  },
  get: () => {
    return localStorage.getItem(ALBUM_ID)
  }
}

export const personaID = {
  set: (val) => {
    localStorage.setItem(PERSONA_ID, val)
  },
  get: () => {
    return localStorage.getItem(PERSONA_ID)
  }
}

export const roles = {
  set: (roles) => {
    localStorage.setItem(ROLES, util.stringifyPersonaRoles(roles))
  },
  get: () => {
    return localStorage.getItem(ROLES)
  }
}

export const personas = {
  set: (personas) => {
    localStorage.setItem(PERSONAS, util.stringifyPersonas(personas))
  },
  get: () => {
    return localStorage.getItem(PERSONAS)
  }
}

export const activePersona = {
  get: () => {
    let personaID = parseInt(localStorage.getItem(PERSONA_ID))
    let personas = JSON.parse(localStorage.getItem(PERSONAS))
    return personas.find(persona => persona.id === personaID)
  }
}
