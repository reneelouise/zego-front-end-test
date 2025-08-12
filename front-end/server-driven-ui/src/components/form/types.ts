export interface UIComponent {
  id: string;
  type: 'text' | 'input' | 'dropdown' | 'button' | 'form';
  label?: string;
  placeholder?: string;
  required?: boolean;
  options?: DropdownOption[];
  children?: UIComponent[];
  className?: string;
  disabled?: boolean;
}

export interface DropdownOption {
  value: string;
  label: string;
}

export interface FormData {
  [key: string]: string | number | boolean;
}

export interface FormConfig {
  title: string;
  description?: string;
  components: UIComponent[];
  submitUrl: string;
  method?: 'POST' | 'PUT' | 'PATCH';
}
