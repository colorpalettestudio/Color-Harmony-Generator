import ThemeToggle from '../ThemeToggle';

export default function ThemeToggleExample() {
  return (
    <div className="p-6 bg-background">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Theme Toggle</h3>
          <p className="text-muted-foreground">Switch between light and dark mode</p>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}