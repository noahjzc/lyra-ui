import type {MouseEvent, ReactNode, RefAttributes} from 'react';

export type ButtonType = 'default' | 'primary' | 'dashed' | 'text' | 'link';

export type SizeType = 'tiny' | 'small' | 'default' | 'large';

export type StatusType = 'success' | 'warning' | 'danger' | 'default';

export interface ButtonProps extends RefAttributes<HTMLButtonElement> {
    /** Button variant style */
    type?: ButtonType;
    /** Button size */
    size?: SizeType;
    status?: StatusType;
    /** Button content */
    children?: ReactNode;
    /** Whether the button is disabled */
    disabled?: boolean;
    /** Whether the button is in loading state */
    loading?: boolean;
    /** Button click handler */
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    /** Additional class name */
    className?: string;
    /** HTML button type */
    htmlType?: 'button' | 'submit' | 'reset';
}
