import { Workspace, IndexedDBDocProvider, uuidv4 } from '@blocksuite/store'
import { useState, useSyncExternalStore } from 'react'

const isSSR = typeof window === 'undefined'
const workspace = new Workspace({
  room: 'my-room',
  providers: !isSSR ? [IndexedDBDocProvider] : [],
  isSSR: typeof window === 'undefined'
})

if (typeof window !== 'undefined') {
  window.workspace = workspace
}

function createPage () {
  workspace.createPage(uuidv4())
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

/**
 *
 * @param props {{ page: import('@blocksuite/store').Page | null}}
 * @constructor
 */
function StorePage ({ page }) {
  if (page === null) {
    return null
  }

  return (
    <div>
      hello, this is {page.id}

      <br/>
      <button
        onClick={() => {
          workspace.removePage(page.id)
        }}
      >delete me
      </button>
    </div>
  )
}

export default function Home () {
  const pages = usePages()
  const [currentPage, setCurrentPage] = useState(null)
  return (
    <div>
      <button
        onClick={() => {
          createPage()
        }}
      >
        create new page
      </button>
      <br/>
      {
        pages.map(page => {
          return (
            <button
              onClick={() => {
                setCurrentPage(page)
              }}
              key={page.id}
            >
              jump tp {page.meta.title || page.id}
            </button>
          )
        })
      }
      <hr/>
      <StorePage page={currentPage}/>
    </div>
  )
}
