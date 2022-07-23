import Router from 'preact-router'
import CustomiseDatabase from './views/CustomiseDatabase'
import DefaultSearch from './views/DefaultSearch'

const Popup = () => {
  return (
    <Router>
      <DefaultSearch default path="/" />
      <CustomiseDatabase path="/customise-database" />
    </Router>
  )
}

export default Popup