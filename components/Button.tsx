import { ButtonHTMLAttributes, ReactNode, FC } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

const Button: FC<Props> = ({ children, ...props }: Props) => {
  const className = `block uppercase shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-2 px-5 rounded ${props.className || ''}`.trim()
  return (
    <button {...props} className={className}>
      {children}
    </button>
  );
}

export default Button;