interface Props {
  children?: React.ReactNode;
  htmlFor: string;
  className?: string;
}

const Label: React.FC<Props> = ({ children, htmlFor, className }) => (
  <label
    htmlFor={htmlFor}
    className={`block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 ${className}`}
  >
    {children}
  </label>
);

export default Label;
