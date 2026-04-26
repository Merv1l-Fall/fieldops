import { useThemeColor } from "@/lib/useThemeColor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ThemeColorPicker() {
  const { color, updateTheme } = useThemeColor();

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="theme-color">Primary Color</Label>
        <div className="flex gap-2">
          <Input
            id="theme-color"
            type="color"
            value={color}
            onChange={(e) => updateTheme(e.target.value)}
            className="h-10 w-16 cursor-pointer"
          />
          <Input
            type="text"
            value={color}
            onChange={(e) => updateTheme(e.target.value)}
            placeholder="#0ea5e9"
            className="flex-1"
          />
        </div>
      </div>

      {/* Show preview of the generated chart colors */}
      <div className="flex gap-2">
        <div className="bg-chart-1 h-12 w-12 rounded" title="Chart 1" />
        <div className="bg-chart-2 h-12 w-12 rounded" title="Chart 2" />
        <div className="bg-chart-3 h-12 w-12 rounded" title="Chart 3" />
        <div className="bg-chart-4 h-12 w-12 rounded" title="Chart 4" />
        <div className="bg-chart-5 h-12 w-12 rounded" title="Chart 5" />
      </div>
    </div>
  );
}
