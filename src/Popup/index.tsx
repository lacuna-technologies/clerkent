import * as React from 'react'
import { createRoot } from 'react-dom/client'
import Popup from './Popup'

const container = document.querySelector(`#popup-root`)
const root = createRoot(container)

root.render(<Popup />)