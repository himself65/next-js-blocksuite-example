import { Workspace } from '@blocksuite/store'
import { useSyncExternalStore } from 'react'

const workspace = new Workspace({
  room: 'my-room',
  isSSR: typeof window === 'undefined'
})

if (typeof window !== 'undefined') {
  window.workspace = workspace
}

let id = 0

function createPage () {
  workspace.createPage(`${id++}`)
}

/**
 *
 * @type {import('@blocksuite/store').Page[]}
 */
let pages = []

function usePages () {
  return useSyncExternalStore(
    (callback) => {
      const a = workspace.signals.pageAdded.on((id) => {
        const page = workspace.getPage(id)
        pages = [...pages, page]
        callback()
      })
      const b = workspace.signals.pagesUpdated.on(callback)
      const c = workspace.signals.pageRemoved.on((id) => {
        const target = pages.findIndex(page => page.id === id)
        pages.splice(target, 1)
        pages = [...pages]
        callback()
      })
      return () => {
        a.dispose()
        b.dispose()
        c.dispose()
      }
    },
    () => pages,
    () => pages
  )
}

export default function Home () {
  const pages = usePages()
  return (
    <div>
      hello, world
      <button
        onClick={() => {
          createPage()
        }}
      >create new page</button>
      <br/>
      {
        pages.map(page => {
          return <div key={page.id}>{page.id}</div>
        })
      }
    </div>
  )
}
