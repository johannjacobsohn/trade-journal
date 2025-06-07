import React from 'react';
import { Link as RadixLink } from '@radix-ui/themes';
import type { LinkProps as RadixLinkProps } from '@radix-ui/themes';
import { Link as NavLink } from '@tanstack/react-router';
import type { LinkProps as NavLinkProps } from '@tanstack/react-router';

interface LinkProps extends NavLinkProps {
  children: React.ReactNode;
  color?: RadixLinkProps['color'];
  weight?: RadixLinkProps['weight'];
  size?: RadixLinkProps['size'];
  style?: RadixLinkProps['style'];
}

export const Link: React.FC<LinkProps> = ({
  children,
  color,
  weight,
  style,
  ...props
}) => {
  return (
    <RadixLink
      asChild
      underline="always"
      color={color}
      weight={weight}
      style={style}>
      <NavLink {...props}>{children}</NavLink>
    </RadixLink>
  );
};
