import * as React from 'react'
import { createRoot } from 'react-dom/client'
import Guide from './Guide'

const container = document.querySelector(`#clerkent-guide-root`)
const root = createRoot(container)

root.render(<Guide /> )