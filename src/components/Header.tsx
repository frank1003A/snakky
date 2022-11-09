import { Component, ComponentProps } from 'solid-js';

interface HeaderProps extends ComponentProps<any> {
    text?: string
}

const Header: Component<HeaderProps> = (props: HeaderProps) => {
    return (
        <div>
            <h2>{props.text}</h2>
        </div>
    )
}

export default Header;