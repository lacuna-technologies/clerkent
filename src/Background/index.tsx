import { render } from 'preact'
import BackgroundPage from './BackgroundPage'

const container = document.querySelector(`#background-root`)
render(<BackgroundPage />, container)