
/**
 * Renders a checkbox for a todo item.
 *
 * @param {Object} props - The component props.
 * @param {string} props.id - The unique identifier of the todo item.
 * @param {boolean} props.isCompleted - Indicates whether the todo item is completed or not.
 * @returns {JSX.Element} The rendered checkbox component.
 */
export function TodoCheckbox({ isCompleted=false, handleUpdate }) {

  /**
   * Handles the checkbox change event.
   */
  function handleCheckbox() {
    handleUpdate({ isCompleted: !isCompleted })
  }

  return (
    <input type="checkbox" checked={isCompleted} onChange={handleCheckbox} />
  )
}