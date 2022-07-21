import { render } from 'preact'
import Popup from './Popup'

const container = document.querySelector(`#popup-root`)
render(<Popup />, container)