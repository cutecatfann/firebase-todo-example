
// This code defines a functional component called Button.
// It takes in props including onClick, children, and rest.
// When the button is clicked, the onClick function is called.
// The rest of the props are spread onto the button element.
export function Button({ onClick, children, ...rest }) {
  return (
    <button onClick={onClick} {...rest}>
      {children}
    </button>
  )
}