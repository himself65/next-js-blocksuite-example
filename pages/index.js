import { workspace, useAppStore } from '../store'
import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('../components/editor'), {
  ssr: false
})

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
      <Editor page={page}/>
    </div>
  )
}

export default function Home () {
  const pages = useAppStore(store => store.pages)
  const currentPage = useAppStore(store => store.currentPage)
  const createPage = useAppStore(store => store.createPage)
  const setCurrentPage = useAppStore(store => store.setCurrentPage)
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
