import { paths } from './paths'
import { components } from './components'
import { schemas } from './schemas'
import { tags } from './tags'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API do Curso do Rodrigo Manguinho para realizar enquetes entre programadores',
    version: '1.0.0'
  },
  license: {
    name: 'GPL-3.0-or-later',
    url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
  },
  servers: [
    {
      url: '/api'
    }
  ],
  tags,
  paths,
  schemas,
  components
}
