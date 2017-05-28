require('../')({
  queryTarget: 'https://www.graphqlhub.com/graphql',
  bindToDom: true
}, (component, graph) => component`
  <div class='tc'>
    <h2> HN </h2>
    ${graph('hn', 'topStories(limit: 10)').map(graph => component`
    <a href=${graph('url')} class='link'>
      <div class='w-80 bg-red dib ma2 bg-animate hover-bg-light-red'>
        <h3 class='f3'> [${graph('score')}] : ${graph('title')} </h3>
      </div>
    </a>
    `)}
  </div>`
)
