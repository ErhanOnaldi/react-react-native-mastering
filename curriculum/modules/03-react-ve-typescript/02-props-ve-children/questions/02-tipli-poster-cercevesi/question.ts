import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tipli poster çerçevesi',
  difficulty: 'kolay',
  concepts: ['react.props', 'react.children', 'ts.optional-nullable'],
  files: ['PosterFrame.tsx'],
  hints: [
    '`children` yalnız düz yazı olmayabilir; JSX çocuk da kabul edilmeli.',
    '`ReactNode` tipini import et; `caption` alanını opsiyonel yap.',
    '`figure` içine `{children}` ve `<figcaption>{caption}</figcaption>` koy; parametrede varsayılan caption ver.',
  ],
})
