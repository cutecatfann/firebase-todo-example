
/**
 * Renders the title of a todo.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the todo.
 * @returns {JSX.Element} The rendered title component.
 */
export function TodoTitle({ title='' }) {
  return (
    <div className='todo__items__title'>{title}</div>
  )
}
