import {
  ChangeEvent,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  type: string;
};

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  type: string;
};

const Input: React.FC<Props> = (props) => {
  const { value, children, ...textareaProps } = props;

  return props.type === 'textarea' ? (
    <textarea {...textareaProps}>{value}</textarea>
  ) : (
    <input {...props} />
  );
};

export default Input;

<input
  name="newName"
  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
  value={newName}
  onChange={(e) => setNewName(e.target.value)}
/>;
