import { mapGetters } from 'vuex'

export default {
  async fetch({ store, params }) {
    await Promise.all([
      store.dispatch('caching/cacheReps'),
      store.dispatch('caching/cacheParties'),
      store.dispatch('caching/cacheCaucuses'),
      store.dispatch('caching/cacheGovAgencies'),
      store.dispatch('caching/cacheLegislativeSteps')
    ])
  },
  computed: {
    ...mapGetters({
      cachedReps: 'caching/reps',
      cachedParties: 'caching/parties',
      cachedCaucuses: 'caching/caucuses',
      cachedGovAgencies: 'caching/govAgencies',
      cachedLegislativeSteps: 'caching/legislativeSteps'
    })
  },
  methods: {
    cachedRep(id) {
      return this.cachedReps.find(rep => rep.id === id)
    },
    cachedParty(id) {
      return this.cachedParties.find(party => party.id === id)
    },
    cachedCaucus(id) {
      return this.cachedCaucuses.find(caucus => caucus.id === id)
    },
    cacheGovAgency(id) {
      return this.cacheGovAgencies.find(agency => agency.id === id)
    },
    cacheLegislativeStep(id) {
      return this.cacheLegislativeSteps.find(step => step.id === id)
    }
  }
}
