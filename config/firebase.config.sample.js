let projects = [
  {
    name: 'project-name',
    id: 'project-id',
    apiKey: 'project-api-key'
  }
]

export default {
  projects: Object.assign({}, ...projects.map(project => ({
    [project.name]: {
      apiKey: project.apiKey,
      authDomain: `https://${project.id}.firebaseio.com`,
      projectId: project.id
    }
  })))
}
