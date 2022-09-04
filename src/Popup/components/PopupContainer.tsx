import type { FunctionComponent } from "preact"

const PopupContainer: FunctionComponent = ({ children }) => (
  <section className="flex flex-col overflow-x-hidden overflow-y-auto min-h-[400px] max-h-96 w-112 p-4">
    {children}
  </section>
)

export default PopupContainer