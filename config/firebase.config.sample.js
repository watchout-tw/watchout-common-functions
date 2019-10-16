let projects = [
  {
    name: 'project-name',
    id: 'project-id',
    apiKey: 'project-api-key'
  }
]

export default {
  sysUsers: {
    userID: : {
      email: 'email',
      password: 'password'
    }// add more system users
  },
  projects: Object.assign({}, ...projects.map(project => ({
    [project.name]: {
      apiKey: project.apiKey,
      authDomain: `https://${project.id}.firebaseio.com`,
      projectId: project.id
    }
  })))
}
