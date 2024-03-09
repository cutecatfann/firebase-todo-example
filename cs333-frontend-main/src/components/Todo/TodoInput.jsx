
/**
 * Renders an input field for a todo item.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the todo item.
 * @param {function} props.handleInputChange - The event handler for input change.
 * @returns {JSX.Element} The rendered input field.
 */
export function TodoInput({ title, handleInputChange }) {

  /**
   * Handles the onFocus event for the input element.
   * Selects the text in the input element.
   *
   * @param {Event} e - The onFocus event object.
   * @returns {void}
   */
  const handleOnFocus = (e) => {
    e.target.select();
  }

  return (
    <input 
      autoFocus 
      type="text" 
      value={title} 
      onChange={handleInputChange} 
      onFocus={handleOnFocus} 
    />
  )
}