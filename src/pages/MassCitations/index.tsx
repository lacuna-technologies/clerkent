import * as React from 'react'
import { createRoot } from 'react-dom/client'
import MassCitations from './MassCitations'

const container = document.querySelector(`#mass-citations-root`)
const root = createRoot(container)

root.render(<MassCitations /> )
