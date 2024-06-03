import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { mdxCompiler } from '../mdx-compiler'
import { Statistics } from '../components/markdown-editor/lib/getEditorStat'
import { ViewUpdate } from '@codemirror/view'

type MarkdownEditorContext = {
  value: string
  setValue: (value: string, viewUpdate: ViewUpdate) => void
  mdxSource: MDXRemoteSerializeResult | null
  setMdxSource: (value: MDXRemoteSerializeResult | null) => void
  stat: Statistics | null
  setStat: (value: Statistics) => void
}

const MarkdownEditorConext = createContext<MarkdownEditorContext>({
  value: '',
  setValue: () => {},
  mdxSource: null,
  setMdxSource: () => {},
  stat: null,
  setStat: () => {},
})

export function useMarkdownEditor() {
  return useContext(MarkdownEditorConext)
}

type Props = {
  children: React.ReactNode
  value: {
    editorValue: string
  }
}

export const MarkdownEditorProvider = ({ children, value: { editorValue } }: Props) => {
  const [value, setValue] = useState<string>(editorValue)
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null)
  const [stat, setStat] = useState<Statistics | null>(null)

  useEffect(() => {
    async function compileSource() {
      try {
        const result = await mdxCompiler(value, {
          onigHostUrl: process.env.NEXT_PUBLIC_CLIENT_HOST,
        })
        setMdxSource(result)
      } catch (error) {
        console.error('failed mdx compile: ', error)
        throw error
      }
    }
    compileSource()
  }, [value])

  const context: MarkdownEditorContext = {
    value,
    setValue,
    mdxSource,
    setMdxSource,
    stat,
    setStat,
  }

  return <MarkdownEditorConext.Provider value={context}>{children}</MarkdownEditorConext.Provider>
}
