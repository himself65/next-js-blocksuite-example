import { loadBlockSchema, EditorContainer } from '@blocksuite/editor'
import React, { useEffect, useRef } from 'react'
import { Page, Text } from '@blocksuite/store'
import { workspace } from '../store'

loadBlockSchema().then(schema => {
  console.log('register schema')
  workspace.register(schema)
})

export default function Editor ({ page }: { page: Page }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) {
      const container = ref.current
      const editor = new EditorContainer()
      editor.page = page
      if (page.root === null) {
        const pageBlockId = page.addBlock({ flavour: 'affine:page' })
        const groupId = page.addBlock({ flavour: 'affine:group' }, pageBlockId)
        page.addBlock(
          {
            flavour: 'affine:paragraph',
            text: new Text(page, 'Hello, world!'),
          },
          groupId
        )
        page.addBlock(
          {
            flavour: 'affine:paragraph',
            text: new Text(page, 'This is your initial page for ' + page.id),
          },
          groupId
        )

      }
      container.appendChild(editor)
      return () => {
        container.removeChild(editor)
      }
    }
    return () => {}
  }, [page])
  return (
    <div className="editor-wrapper" ref={ref}/>
  )
}