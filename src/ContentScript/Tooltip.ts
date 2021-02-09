let tooltipTimeout: NodeJS.Timeout
const timeoutDuration = 50

const hideTooltip = () => {
  const tooltip: HTMLElement = document.querySelector(`#clerkent-tooltip`)
  tooltip.style.display = `none`
}

const startTimer = () => {
  tooltipTimeout = setTimeout(hideTooltip, timeoutDuration)
}
const stopTimer = () => clearTimeout(tooltipTimeout)

const init = () => {
  const tooltip = document.createElement(`div`)
  tooltip.id = `clerkent-tooltip`
  tooltip.className = `clerkent`
  tooltip.addEventListener(`mouseover`, stopTimer)
  tooltip.addEventListener(`mouseout`, startTimer)
  document.body.append(tooltip)
}

const Tooltip = {
  hideTooltip,
  init,
  startTimer,
  stopTimer,
}

export default Tooltip