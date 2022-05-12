import * as React from 'react'
import { createRoot } from 'react-dom/client'

import BackgroundPage from './BackgroundPage'

const container = document.querySelector(`#background-root`)
const root = createRoot(container)
root.render(<BackgroundPage />)
