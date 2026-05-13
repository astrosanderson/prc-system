interface WidgetProps {
  title: string;
  icon?: string;
  dark?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/** Sidebar widget card used in both dashboards */
export function Widget({ title, icon, dark = false, children, footer }: WidgetProps) {
  return (
    <div className={`widget${dark ? ' widget-dark' : ''}`}>
      <h4 className="widget-title">
        {icon && (
          <span className={`material-symbols-outlined ${dark ? '' : 'text-secondary'}`}>
            {icon}
          </span>
        )}
        {title}
      </h4>
      {children}
      {footer}
    </div>
  );
}
