// Path: lib/tiptap/render-content.tsx
// Status: NY
// Formål: Render Tiptap-JSON (fra chapters.content) til read-only React-elementer.
// @tiptap/core's generateHTML kræver et `window`-objekt og fejler server-side —
// testet direkte ("window is not defined") — derfor denne lette renderer for de
// node-/mark-typer StarterKit producerer (paragraph, heading, lister, osv.).

import type { JSONContent } from '@tiptap/core'
import React from 'react'

function renderMarks(
  text: string,
  marks: JSONContent['marks'] = [],
  key: number
): React.ReactNode {
  let node: React.ReactNode = text

  for (const mark of marks ?? []) {
    switch (mark.type) {
      case 'bold':
        node = <strong>{node}</strong>
        break
      case 'italic':
        node = <em>{node}</em>
        break
      case 'strike':
        node = <s>{node}</s>
        break
      case 'code':
        node = <code>{node}</code>
        break
    }
  }

  return <React.Fragment key={key}>{node}</React.Fragment>
}

function renderChildren(content: JSONContent[] = []): React.ReactNode {
  return content.map((node, i) => renderNode(node, i))
}

function renderNode(node: JSONContent, key: number): React.ReactNode {
  switch (node.type) {
    case 'text':
      return renderMarks(node.text ?? '', node.marks, key)
    case 'paragraph':
      return <p key={key}>{renderChildren(node.content)}</p>
    case 'heading': {
      const level = (node.attrs?.level ?? 2) as 1 | 2 | 3 | 4 | 5 | 6
      const Tag = `h${level}` as keyof JSX.IntrinsicElements
      return <Tag key={key}>{renderChildren(node.content)}</Tag>
    }
    case 'bulletList':
      return <ul key={key}>{renderChildren(node.content)}</ul>
    case 'orderedList':
      return <ol key={key}>{renderChildren(node.content)}</ol>
    case 'listItem':
      return <li key={key}>{renderChildren(node.content)}</li>
    case 'blockquote':
      return <blockquote key={key}>{renderChildren(node.content)}</blockquote>
    case 'codeBlock':
      return (
        <pre key={key}>
          <code>{renderChildren(node.content)}</code>
        </pre>
      )
    case 'hardBreak':
      return <br key={key} />
    case 'horizontalRule':
      return <hr key={key} />
    default:
      return node.content ? <div key={key}>{renderChildren(node.content)}</div> : null
  }
}

interface RenderTiptapContentProps {
  content: JSONContent
}

export function RenderTiptapContent({ content }: RenderTiptapContentProps) {
  return (
    <div
      className="space-y-4 leading-relaxed [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
    >
      {renderChildren(content.content)}
    </div>
  )
}
