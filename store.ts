import create from 'zustand'
import { Workspace, IndexedDBDocProvider, uuidv4, Page } from '@blocksuite/store'

const isSSR = typeof window === 'undefined'

export const workspace = new Workspace({
  room: 'my-room',
  providers: !isSSR ? [IndexedDBDocProvider] : [],
  isSSR: typeof window === 'undefined'
})

workspace.signals.pageAdded.on((id) => {
  const page = workspace.getPage(id)
  useAppStore.setState((state: any) => ({
    pages: [...state.pages, page]
  }))
})

workspace.signals.pageRemoved.on((id) => {
  useAppStore.setState(({ pages }: any) => {
    const target = pages.findIndex((page: Page) => page.id === id)
    pages.splice(target, 1)
    pages = [...pages]
    return {
      pages
    }
  })
})

export const useAppStore = create((set) => ({
  currentPage: null as Page | null,
  pages: [] as Page [],
  createPage: () => {
    workspace.createPage(uuidv4())
  },
  setCurrentPage: (page: Page) => {
    set({
      currentPage: page
    })
  }
}))