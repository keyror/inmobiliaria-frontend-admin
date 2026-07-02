export interface IDropdownAction {
  label?: string;
  icon?: string;
  show?: boolean;
  variant?: string;
  href?: string;
  target?: string;
  onClick?: () => void;
  divider?: boolean;
}
