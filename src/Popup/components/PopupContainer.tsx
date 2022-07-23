import type { FunctionComponent } from "preact"

const PopupContainer: FunctionComponent = ({ children }) => (
  <section className="overflow-x-hidden overflow-y-scroll h-min w-112 min-h-32 p-4">
    {children}
  </section>
)

export default PopupContainer